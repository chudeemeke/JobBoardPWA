// Quick fix for slow loading - skip external API calls on first load

export class JobBoardService {
    constructor(app) {
        this.app = app;
        this.boards = [];
        this.syncInProgress = false;
        this.lastSync = null;
    }

    async initialize() {
        // Load boards from database
        this.boards = await this.app.db.jobBoards.toArray();
        
        // DON'T sync on first load - this is likely causing the delay
        // this.syncJobs(); // COMMENTED OUT - was causing 3+ minute load
        
        return true;
    }

    async syncJobs() {
        // Skip if offline
        if (!navigator.onLine) {
            console.log('Offline - skipping job sync');
            return;
        }

        // Skip if recently synced
        if (this.lastSync && Date.now() - this.lastSync < 300000) { // 5 minutes
            console.log('Recently synced - skipping');
            return;
        }

        if (this.syncInProgress) {
            console.log('Sync already in progress');
            return;
        }

        this.syncInProgress = true;

        try {
            // Get enabled boards
            const enabledBoards = this.boards.filter(board => board.enabled);
            
            // Sync each board with timeout
            for (const board of enabledBoards) {
                try {
                    await this.syncBoard(board);
                } catch (error) {
                    console.error(`Failed to sync ${board.name}:`, error);
                    // Continue with other boards
                }
            }
            
            this.lastSync = Date.now();
            this.app.services.message.success('Jobs updated!');
            
        } catch (error) {
            console.error('Job sync failed:', error);
            this.app.services.message.error('Failed to update jobs');
        } finally {
            this.syncInProgress = false;
        }
    }

    async syncBoard(board) {
        console.log(`Syncing ${board.name}...`);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            let url = board.apiUrl;
            
            // Special handling for different board types
            switch (board.name) {
                case 'RemoteOK':
                    // Use CORS proxy for RemoteOK
                    url = `https://api.allorigins.win/raw?url=${encodeURIComponent(board.apiUrl)}`;
                    break;
                    
                case 'Community Gist':
                    // Skip if no gist ID
                    if (!board.config?.gistId) {
                        console.log('No community gist ID configured');
                        return;
                    }
                    url = board.apiUrl.replace('{gistId}', board.config.gistId);
                    break;
            }
            
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            clearTimeout(timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            await this.processJobData(board, data);
            
        } catch (error) {
            clearTimeout(timeout);
            
            if (error.name === 'AbortError') {
                console.error(`Timeout syncing ${board.name}`);
            } else {
                console.error(`Error syncing ${board.name}:`, error);
            }
            throw error;
        }
    }

    async processJobData(board, data) {
        // Process based on board type
        let jobs = [];
        
        switch (board.name) {
            case 'RemoteOK':
                jobs = this.parseRemoteOKJobs(data);
                break;
            case 'GitHub Jobs':
                jobs = this.parseGitHubJobs(data);
                break;
            case 'Community Gist':
                jobs = this.parseCommunityJobs(data);
                break;
            default:
                console.warn(`Unknown board type: ${board.name}`);
        }
        
        // Save jobs to database
        if (jobs.length > 0) {
            await this.saveJobs(jobs, board.name);
            console.log(`Saved ${jobs.length} jobs from ${board.name}`);
        }
    }

    parseRemoteOKJobs(data) {
        if (!Array.isArray(data)) return [];
        
        return data.slice(0, 50).map(job => ({
            externalId: job.id || job.slug,
            source: 'RemoteOK',
            title: job.position || job.title,
            company: job.company,
            location: job.location || 'Remote',
            type: 'remote',
            salary: job.salary || 'Not specified',
            posted: job.date || new Date().toISOString(),
            description: job.description || '',
            url: job.url || job.apply_url,
            keywords: job.tags || []
        }));
    }

    parseGitHubJobs(data) {
        if (!data.items || !Array.isArray(data.items)) return [];
        
        return data.items.slice(0, 30).map(issue => ({
            externalId: issue.id,
            source: 'GitHub',
            title: issue.title,
            company: issue.repository?.full_name || 'GitHub',
            location: 'Remote',
            type: 'remote',
            salary: 'See listing',
            posted: issue.created_at,
            description: issue.body || '',
            url: issue.html_url,
            keywords: issue.labels?.map(l => l.name) || []
        }));
    }

    parseCommunityJobs(data) {
        if (!data.files) return [];
        
        // Assuming gist contains JSON file with job listings
        const content = Object.values(data.files)[0]?.content;
        if (!content) return [];
        
        try {
            const jobs = JSON.parse(content);
            return Array.isArray(jobs) ? jobs : [];
        } catch (error) {
            console.error('Failed to parse community jobs:', error);
            return [];
        }
    }

    async saveJobs(jobs, source) {
        const existingJobs = await this.app.db.jobs
            .where('source')
            .equals(source)
            .toArray();
        
        const existingIds = new Set(existingJobs.map(j => j.externalId));
        
        const newJobs = jobs.filter(job => !existingIds.has(job.externalId));
        
        if (newJobs.length > 0) {
            await this.app.db.jobs.bulkAdd(newJobs);
        }
    }

    async searchJobs(query, filters = {}) {
        let jobs = await this.app.db.jobs.toArray();
        
        // Apply search
        if (query) {
            const searchLower = query.toLowerCase();
            jobs = jobs.filter(job => 
                job.title.toLowerCase().includes(searchLower) ||
                job.company.toLowerCase().includes(searchLower) ||
                job.description?.toLowerCase().includes(searchLower) ||
                job.keywords?.some(k => k.toLowerCase().includes(searchLower))
            );
        }
        
        // Apply filters
        if (filters.location) {
            jobs = jobs.filter(job => 
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        if (filters.type) {
            jobs = jobs.filter(job => job.type === filters.type);
        }
        
        if (filters.source) {
            jobs = jobs.filter(job => job.source === filters.source);
        }
        
        // Sort by date
        jobs.sort((a, b) => new Date(b.posted) - new Date(a.posted));
        
        return jobs;
    }

    startBackgroundSync() {
        // Sync every 30 minutes, but not on startup
        setInterval(() => {
            if (navigator.onLine) {
                this.syncJobs();
            }
        }, 1800000); // 30 minutes
    }
}
