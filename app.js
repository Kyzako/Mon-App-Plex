// Récupérer les informations d'identification pour l'API Plex et YouTube à partir des variables d'environnement
const plexToken = process.env.PLEX_TOKEN;
const plexBaseURL = process.env.PLEX_BASE_URL;
const youtubeApiKey = process.env.YOUTUBE_API_KEY;

// Éléments du DOM
const thumbnail = document.getElementById('thumbnail');
const titleElement = document.getElementById('title');
const summary = document.getElementById('summary');
const trailer = document.getElementById('trailer');
const watchButton = document.getElementById('watchButton');

// Fonction pour obtenir un contenu aléatoire
async function getRandomContent() {
    try {
        const response = await fetch(`${plexBaseURL}/library/sections/16/all?X-Plex-Token=${plexToken}`);
        const data = await response.text();
        console.log('Données reçues de l\'API Plex :', data);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'application/xml');
        const videos = Array.from(xmlDoc.getElementsByTagName('Video'));
        console.log('Tableau des vidéos :', videos);
        const randomIndex = Math.floor(Math.random() * videos.length);
        const randomVideo = videos[randomIndex];
        console.log('Vidéo sélectionnée :', randomVideo);

        // Récupérer les informations du contenu
        const videoTitle = randomVideo.getAttribute('title');
        const videoSummary = randomVideo.getAttribute('summary');
        const videoThumb = `${plexBaseURL}${randomVideo.getAttribute('thumb')}?X-Plex-Token=${plexToken}`;
        const videoKey = randomVideo.getAttribute('key');

        // Afficher les informations du contenu
        thumbnail.src = videoThumb;
        titleElement.textContent = videoTitle;
        summary.textContent = videoSummary;
        // Chercher la bande-annonce sur YouTube
        const youtubeResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(videoTitle + ' bande annonce VF')}&type=video&key=${youtubeApiKey}`);
        const youtubeData = await youtubeResponse.json();
        const trailerVideoId = youtubeData.items[0].id.videoId;
        trailer.href = `https://www.youtube.com/watch?v=${trailerVideoId}`;

        watchButton.textContent = 'Ouvrir Plex';
        watchButton.addEventListener('click', () => {
            window.location.href = 'plex://';
        });
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération du contenu :', error);
    }
}

// Charger le contenu aléatoire lors du chargement de la page
getRandomContent();

