import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  ogType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta) { }

  updateMetaTags(config: SeoConfig) {
    // Set Title
    const pageTitle = `${config.title} | WGC - Way Point Gateway Collective`;
    this.title.setTitle(pageTitle);

    // Set description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: pageTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:type', content: config.ogType || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'WGC - Way Point Gateway Collective' });
    
    // Twitter Card
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: pageTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
  }
}
