document.addEventListener('DOMContentLoaded', () => {
    // --- Data Injection (CMS Functionality) ---
    // portfolioData is loaded from data.js
    if (typeof portfolioData !== 'undefined') {
        // Update Personal Info
        document.title = `${portfolioData.personal.name} | Portfolyo`;
        document.getElementById('hero-title').textContent = portfolioData.personal.name;
        document.getElementById('hero-title').setAttribute('data-text', portfolioData.personal.name);
        document.getElementById('hero-subtitle').textContent = portfolioData.personal.bio;
        
        const contactEmail = document.getElementById('contact-email');
        contactEmail.href = `mailto:${portfolioData.personal.email}`;

        // Populate Socials
        const socialsContainer = document.getElementById('social-links');
        if (portfolioData.personal.socials && socialsContainer) {
            const icons = {
                instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
                youtube: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
                discord: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.03.03.03.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.02.02.05.03.07.02c1.71-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z"></path></svg>',
                linkedin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
            };
            for (const [platform, url] of Object.entries(portfolioData.personal.socials)) {
                if (url && icons[platform]) {
                    socialsContainer.innerHTML += `<a href="${url}" target="_blank" class="social-icon ${platform}" title="${platform}">${icons[platform]}</a>`;
                }
            }
        }

        // Populate Gallery
        const galleryGrid = document.getElementById('gallery-grid');
        portfolioData.gallery.forEach(item => {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.setAttribute('data-id', item.id);
            
            // Otomatik tür algılama
            let actualType = item.type;
            let youtubeId = item.youtubeId;
            let sunoId = null;
            let targetUrl = item.url || item.instagramUrl || item.audioUrl; // Geriye dönük uyumluluk

            if (targetUrl) {
                if (targetUrl.includes('instagram.com/p/') || targetUrl.includes('instagram.com/reel/')) {
                    actualType = 'instagram';
                } else if (targetUrl.includes('youtube.com/watch') || targetUrl.includes('youtu.be/')) {
                    actualType = 'youtube';
                    const match = targetUrl.match(/[?&]v=([^&]+)/) || targetUrl.match(/youtu\.be\/([^?]+)/);
                    if (match) youtubeId = match[1];
                }
            }

            // Suno AI link algılama (audioUrl için)
            if (item.audioUrl && item.audioUrl.includes('suno.com')) {
                const sunoMatch = item.audioUrl.match(/suno\.com\/s\/([^?/]+)/) || item.audioUrl.match(/suno\.com\/song\/([^?/]+)/);
                if (sunoMatch) sunoId = sunoMatch[1];
            }

            // Objeye ekleyelim ki modal'da da kullanalım
            item._actualType = actualType;
            item._youtubeId = youtubeId;
            item._sunoId = sunoId;
            item._targetUrl = targetUrl;

            let mediaHtml = '';
            if (actualType === 'album') {
                mediaHtml = `<img src="${item.coverUrl}" alt="${item.title}" loading="lazy">
                             <div class="album-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg> Albüm (${item.items ? item.items.length : 0})</div>`;
            } else if (actualType === 'image') {
                mediaHtml = `<img src="${targetUrl}" alt="${item.title}" loading="lazy">`;
            } else if (actualType === 'video') {
                mediaHtml = `<video src="${targetUrl}" muted loop playsinline autoplay></video>`;
            } else if (actualType === 'youtube') {
                mediaHtml = `<img src="https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg" alt="${item.title}" loading="lazy">
                             <div class="media-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="var(--accent-1)" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></div>`;
            } else if (actualType === 'music') {
                mediaHtml = `<img src="${item.coverUrl}" alt="${item.title}" loading="lazy">
                             <div class="media-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg></div>`;
            } else if (actualType === 'instagram') {
                const thumb = item.thumbnailUrl || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop';
                mediaHtml = `<img src="${thumb}" alt="${item.title}" loading="lazy">
                             <div class="media-icon insta-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e6683c" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></div>`;
            }

            div.innerHTML = `
                <div class="gallery-template">
                    <div class="tech-corner corner-tl"></div>
                    <div class="tech-corner corner-tr"></div>
                    <div class="tech-corner corner-bl"></div>
                    <div class="tech-corner corner-br"></div>
                    <div class="media-container">
                        ${mediaHtml}
                    </div>
                    <div class="item-overlay">
                        <div class="overlay-content">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                            <div class="view-details">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                                <span>İncele</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Modal click event
            div.addEventListener('click', () => openModal(item));
            galleryGrid.appendChild(div);
        });

        // Populate Projects
        const projectsGrid = document.getElementById('projects-grid');
        portfolioData.projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'project-card';
            
            const techTags = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
            
            div.innerHTML = `
                <div class="project-title">
                    ${project.title}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </div>
                <div class="project-tech">
                    ${techTags}
                </div>
                <p>${project.description}</p>
                <a href="${project.link}" target="_blank" class="project-link">İncele</a>
            `;
            projectsGrid.appendChild(div);
        });
    }

    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    });

    // Hover effects for cursor
    const hoverElements = document.querySelectorAll('a, .gallery-item, .cyber-button');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
            cursorOutline.style.backgroundColor = 'rgba(0, 255, 204, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '40px';
            cursorOutline.style.height = '40px';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // --- Navigation & Scroll Logic ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    function setActiveLink(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // Intersection Observer for sections
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                setActiveLink(id);
                // Also trigger entrance animation
                entry.target.classList.add('active-section');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
        // Initially show home
        if (section.id === 'home') section.classList.add('active-section');
        else section.style.display = 'flex'; // Ensure flex layout is ready
    });

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Scroll Progress logic
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // --- Modal Logic ---
    const modal = document.getElementById('media-modal');
    const modalContent = document.getElementById('modal-content');
    const modalCaption = document.getElementById('modal-caption');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');
    
    let currentAlbum = null;
    let currentAlbumIndex = 0;
    
    // --- Zoom Variables ---
    let zoomLevel = 1;
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentX = 0, currentY = 0;
    let currentZoomImg = null;

    function resetZoom() {
        zoomLevel = 1;
        currentX = 0;
        currentY = 0;
        if (currentZoomImg) {
            currentZoomImg.style.transform = `translate(0px, 0px) scale(1)`;
            currentZoomImg.style.cursor = 'zoom-in';
            currentZoomImg.style.transition = 'transform 0.15s ease-out';
        }
    }

    function initZoom(imgElement) {
        currentZoomImg = imgElement;
        resetZoom();
    }

    function renderAlbumItem() {
        if (!currentAlbum || !currentAlbum.items) return;
        const item = currentAlbum.items[currentAlbumIndex];
        
        let targetUrl = item.url || item.instagramUrl || item.audioUrl;
        let actualType = item.type;
        let youtubeId = item.youtubeId;
        let sunoId = null;

        if (targetUrl) {
            if (targetUrl.includes('instagram.com/p/') || targetUrl.includes('instagram.com/reel/')) {
                actualType = 'instagram';
            } else if (targetUrl.includes('youtube.com/watch') || targetUrl.includes('youtu.be/')) {
                actualType = 'youtube';
                const match = targetUrl.match(/[?&]v=([^&]+)/) || targetUrl.match(/youtu\.be\/([^?]+)/);
                if (match) youtubeId = match[1];
            }
        }
        
        if (item.audioUrl && item.audioUrl.includes('suno.com')) {
            const sunoMatch = item.audioUrl.match(/suno\.com\/s\/([^?/]+)/) || item.audioUrl.match(/suno\.com\/song\/([^?/]+)/);
            if (sunoMatch) sunoId = sunoMatch[1];
        }

        if (actualType === 'image') {
            modalContent.innerHTML = `<img src="${targetUrl}" alt="Albüm Öğesi" class="zoomable-img">`;
            initZoom(modalContent.querySelector('.zoomable-img'));
        } else if (actualType === 'video') {
            modalContent.innerHTML = `<video src="${targetUrl}" controls autoplay></video>`;
        } else if (actualType === 'youtube') {
            modalContent.innerHTML = `<div class="iframe-container"><iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        } else if (actualType === 'instagram') {
            const cleanUrl = targetUrl.split('?')[0];
            const embedUrl = cleanUrl.endsWith('/') ? cleanUrl + 'embed' : cleanUrl + '/embed';
            modalContent.innerHTML = `<iframe src="${embedUrl}" width="400" height="500" frameborder="0" scrolling="no" allowtransparency="true" class="instagram-iframe"></iframe>`;
        } else if (actualType === 'music') {
            if (sunoId) {
                modalContent.innerHTML = `<div class="music-player-container"><img src="${item.coverUrl || 'https://via.placeholder.com/300'}" class="music-cover" alt="Cover"><iframe src="https://suno.com/embed/${sunoId}" width="100%" height="150" frameborder="0" class="suno-embed" allow="autoplay"></iframe></div>`;
            } else {
                modalContent.innerHTML = `<div class="music-player-container"><img src="${item.coverUrl || 'https://via.placeholder.com/300'}" class="music-cover" alt="Cover"><audio src="${item.audioUrl}" controls autoplay class="custom-audio"></audio></div>`;
            }
        }
        
        let captionHtml = `<div class="album-indicator">Albüm Öğesi ${currentAlbumIndex + 1} / ${currentAlbum.items.length}</div>`;
        if (item.description) captionHtml += `<p>${item.description}</p>`;
        if (item.prompt) {
            captionHtml += `
                <div class="prompt-box">
                    <div class="prompt-header">
                        <strong>Kullanılan Prompt:</strong>
                        <button class="copy-prompt-btn" onclick="copyPrompt(this)" data-prompt="${encodeURIComponent(item.prompt)}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Kopyala
                        </button>
                    </div>
                    <code>${item.prompt}</code>
                </div>
            `;
        }
        modalCaption.innerHTML = captionHtml;
        
        modalPrev.style.display = currentAlbumIndex > 0 ? 'flex' : 'none';
        modalNext.style.display = currentAlbumIndex < currentAlbum.items.length - 1 ? 'flex' : 'none';
    }

    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentAlbumIndex > 0) { currentAlbumIndex--; renderAlbumItem(); }
    });
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentAlbumIndex < currentAlbum.items.length - 1) { currentAlbumIndex++; renderAlbumItem(); }
    });

    function openModal(item) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10); // Trigger transition
        
        // Otomatik algılanan türü kullan
        const type = item._actualType || item.type;
        const youtubeId = item._youtubeId || item.youtubeId;
        const targetUrl = item._targetUrl || item.url;

        currentAlbum = null;
        modalPrev.style.display = 'none';
        modalNext.style.display = 'none';

        if (type === 'album') {
            currentAlbum = item;
            currentAlbumIndex = 0;
            renderAlbumItem();
            return; // Exit here so it doesn't run the rest
        } else if (type === 'image') {
            modalContent.innerHTML = `<img src="${targetUrl}" alt="${item.title}" class="zoomable-img">`;
            initZoom(modalContent.querySelector('.zoomable-img'));
        } else if (type === 'video') {
            modalContent.innerHTML = `<video src="${targetUrl}" controls autoplay></video>`;
        } else if (type === 'youtube') {
            modalContent.innerHTML = `<div class="iframe-container"><iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        } else if (type === 'music') {
            const sunoId = item._sunoId;
            if (sunoId) {
                // Suno AI embed player
                modalContent.innerHTML = `
                    <div class="music-player-container">
                        <img src="${item.coverUrl}" class="music-cover" alt="Cover">
                        <iframe src="https://suno.com/embed/${sunoId}" width="100%" height="150" frameborder="0" class="suno-embed" allow="autoplay"></iframe>
                    </div>
                `;
            } else {
                // Direkt mp3/wav dosyası
                modalContent.innerHTML = `
                    <div class="music-player-container">
                        <img src="${item.coverUrl}" class="music-cover" alt="Cover">
                        <audio src="${item.audioUrl}" controls autoplay class="custom-audio"></audio>
                    </div>
                `;
            }
        } else if (type === 'instagram') {
            const igUrl = item.instagramUrl || targetUrl;
            const cleanUrl = igUrl.split('?')[0]; // UTM parametrelerini temizle
            const embedUrl = cleanUrl.endsWith('/') ? cleanUrl + 'embed' : cleanUrl + '/embed';
            modalContent.innerHTML = `<iframe src="${embedUrl}" width="400" height="500" frameborder="0" scrolling="no" allowtransparency="true" class="instagram-iframe"></iframe>`;
        }
        
        let captionHtml = `<p>${item.description}</p>`;
        
        if (item.prompt) {
            captionHtml += `
                <div class="prompt-box">
                    <div class="prompt-header">
                        <strong>Kullanılan Prompt:</strong>
                        <button class="copy-prompt-btn" onclick="copyPrompt(this)" data-prompt="${encodeURIComponent(item.prompt)}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Kopyala
                        </button>
                    </div>
                    <code>${item.prompt}</code>
                </div>
            `;
        }
        
        if (item.instagramLink) {
            captionHtml += `
                <a href="${item.instagramLink}" target="_blank" class="instagram-link">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    Instagram'da Gör
                </a>
            `;
        }

        modalCaption.innerHTML = captionHtml;
    }

    // --- Zoom Event Listeners ---
    modalContent.addEventListener('wheel', (e) => {
        if (!currentZoomImg) return;
        e.preventDefault(); // prevent scroll
        const zoomStep = 0.3;
        if (e.deltaY < 0) {
            zoomLevel = Math.min(zoomLevel + zoomStep, 4); // Max 400%
        } else {
            zoomLevel = Math.max(zoomLevel - zoomStep, 1); // Min 100%
        }
        
        if (zoomLevel === 1) {
            currentX = 0;
            currentY = 0;
            currentZoomImg.style.cursor = 'zoom-in';
        } else {
            currentZoomImg.style.cursor = 'grab';
        }
        
        currentZoomImg.style.transition = 'transform 0.15s ease-out';
        currentZoomImg.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;
    });

    modalContent.addEventListener('mousedown', (e) => {
        if (currentZoomImg && zoomLevel > 1 && e.target === currentZoomImg) {
            e.preventDefault();
            isDragging = true;
            startX = e.clientX - currentX;
            startY = e.clientY - currentY;
            currentZoomImg.style.cursor = 'grabbing';
            currentZoomImg.style.transition = 'none'; // Instant drag
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging || !currentZoomImg) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        currentZoomImg.style.transform = `translate(${currentX}px, ${currentY}px) scale(${zoomLevel})`;
    });

    window.addEventListener('mouseup', () => {
        if (isDragging && currentZoomImg) {
            isDragging = false;
            currentZoomImg.style.cursor = zoomLevel > 1 ? 'grab' : 'zoom-in';
            currentZoomImg.style.transition = 'transform 0.15s ease-out';
        }
    });

    modalContent.addEventListener('dblclick', (e) => {
        if (currentZoomImg && e.target === currentZoomImg) {
            if (zoomLevel > 1) {
                resetZoom();
            } else {
                zoomLevel = 2.5; // Quick zoom
                currentZoomImg.style.transition = 'transform 0.3s ease-out';
                currentZoomImg.style.transform = `translate(0px, 0px) scale(${zoomLevel})`;
                currentZoomImg.style.cursor = 'grab';
            }
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            modalContent.innerHTML = ''; // Stop video
            currentZoomImg = null;
            zoomLevel = 1;
            currentX = 0;
            currentY = 0;
        }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // --- 3D Tilt Effect & Dynamic Shine ---
    document.querySelectorAll('.project-card, .gallery-item').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.setProperty('--mouseX', `${(x / rect.width) * 100}%`);
            el.style.setProperty('--mouseY', `${(y / rect.height) * 100}%`);
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // --- Magnetic Elements ---
    document.querySelectorAll('.cyber-button, .social-icon').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0px, 0px)';
        });
    });

    // --- Social Particles ---
    document.querySelectorAll('.social-icon').forEach(icon => {
        icon.addEventListener('mousemove', (e) => {
            if(Math.random() > 0.8) {
                const particle = document.createElement('div');
                particle.className = 'social-particle';
                const rect = icon.getBoundingClientRect();
                particle.style.left = (e.clientX) + 'px';
                particle.style.top = (e.clientY) + 'px';
                
                let color = 'white';
                if(icon.classList.contains('instagram')) color = '#e6683c';
                if(icon.classList.contains('discord')) color = '#5865F2';
                if(icon.classList.contains('youtube')) color = '#FF0000';
                if(icon.classList.contains('linkedin')) color = '#0077b5';
                
                particle.style.background = color;
                particle.style.boxShadow = `0 0 10px ${color}`;
                document.body.appendChild(particle);
                
                const tx = (Math.random() - 0.5) * 60;
                const ty = (Math.random() - 0.5) * 60;
                particle.animate([
                    { transform: 'translate(0,0) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], { duration: 800, easing: 'ease-out' }).onfinish = () => particle.remove();
            }
        });
    });

    // --- Custom Context Menu & Hack Mode ---
    const ctxMenu = document.getElementById('cyber-context-menu');
    
    if (ctxMenu) {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            ctxMenu.style.display = 'flex';
            
            let x = e.clientX;
            let y = e.clientY;
            
            if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
            if (y + 150 > window.innerHeight) y = window.innerHeight - 150;
            
            ctxMenu.style.left = `${x}px`;
            ctxMenu.style.top = `${y}px`;
        });

        document.addEventListener('click', (e) => {
            if (!ctxMenu.contains(e.target)) {
                ctxMenu.style.display = 'none';
            }
        });

        document.getElementById('ctx-copy').addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href);
            ctxMenu.style.display = 'none';
        });

        document.getElementById('ctx-hack').addEventListener('click', () => {
            document.documentElement.classList.toggle('hacked-mode');
            const isHacked = document.documentElement.classList.contains('hacked-mode');
            document.getElementById('ctx-hack').innerHTML = isHacked ? 
                `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Sistemi Geri Al` :
                `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> Sistemi Hackle`;
            ctxMenu.style.display = 'none';
        });

        document.getElementById('ctx-mail').addEventListener('click', () => {
            window.location.href = `mailto:${portfolioData.personal.email}`;
            ctxMenu.style.display = 'none';
        });
    }
});

// Global function for copy prompt
window.copyPrompt = function(btn) {
    const text = decodeURIComponent(btn.getAttribute('data-prompt'));
    navigator.clipboard.writeText(text).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00ffd5" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg> Kopyalandı`;
        btn.style.color = '#00ffd5';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.color = '';
        }, 2000);
    });
};
