import Ajax from '../helpers/ajax';

export default class Controller {
    constructor(model) {
        this.model = model;
        this.state = this.model.state;
        this.ajax = new Ajax();


        this.fetchImages(1, true);
        this.fetchNavThumbnails();
        //setTimeout(() => document.querySelector('.c-main_preloader').classList.remove('is-open'), 1000);
    }

    handleEvent() { }

    fetchNavThumbnails() {
        const urlBase = `https://boiling-citadel-14104.herokuapp.com/`;
        const url = urlBase + 'static/img/thumbnails';

        this.ajax.get(url).then(data => JSON.parse(data)).then(images => {
            let imgCounter = 0;
            const isImgReady = () => ((imgCounter === 11) ? this.model.setState({ navThumbnails: imgCache }) : null);

            const imgCache = images.map(item => {
                return item.map(item2 => {
                    const img = new Image();
                    img.src = urlBase + item2;
                    img.addEventListener('load', () => { imgCounter += 1; isImgReady() });
                    return img;
                })
            })

        });
    }

    fetchImages(n, fullscreen = false) {
        const imgCache = [];
        let loadedImgs = 0;
        const loader = document.querySelector(`.c-${fullscreen ? 'main' : 'mainpage'}_preloader .c-preloader_text`);
        const url = `https://boiling-citadel-14104.herokuapp.com/static/img/${n}`;

        this.ajax.get(url)
            .then(data => JSON.parse(data)).then(({ images }) => {

                images.forEach(processElement.bind(this));

                function processElement(item) {
                    const img = new Image();
                    const thumb = new Image();
                    img.src = `https://boiling-citadel-14104.herokuapp.com/${item.dir}`;
                    thumb.src = `https://boiling-citadel-14104.herokuapp.com/${item.thumbnail}`;
                    imgCache.push({ dir: img, thumbnail: thumb });

                    img.addEventListener('load', () => {
                        loadedImgs += 1;
                        loader.textContent = Number((loadedImgs / 27) * 100).toFixed(2) + '%';
                        if (loadedImgs === 27) {
                            this.model.setState({ isLoading: false, images: imgCache, loadedPart: Number(n) });
                            console.log('just set state, n=', n)
                            setTimeout(() => loader.textContent = `0%`, 500);
                        }
                    });
                }

            });
    }
}