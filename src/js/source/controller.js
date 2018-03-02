import Ajax from '../helpers/ajax';
import * as Vibrant from 'node-vibrant';

export default class Controller {
    constructor(model) {
        this.model = model;
        this.state = this.model.state;
        this.ajax = new Ajax();

        this.fetchImages(1, true);
        this.fetchNavThumbnails();
        //setTimeout(() => document.querySelector('.c-main_preloader').classList.remove('is-open'), 1000);
        this.setState = function (obj) {
            const self = this;
            this.model.setState(obj, self);
        }
    }

    handleEvent() { }

    fetchNavThumbnails() {
        const urlBase = `https://boiling-citadel-14104.herokuapp.com/`;
        const url = urlBase + 'static/img/thumbnails';

        this.ajax.get(url).then(data => JSON.parse(data)).then(images => {
            let imgCounter = 0;
            const isImgReady = () => ((imgCounter === 11) ? this.setState({ navThumbnails: imgCache }) : null);

            const imgCache = images.map(item => {
                return item.map(item2 => {
                    const img = new Image();
                    img.src = urlBase + item2;
                    img.addEventListener('load', () => { imgCounter += 1; isImgReady(); });
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

                if (n !== 5) images.forEach(processElement.bind(this));
                else images.forEach(processElementSpecial.bind(this));

                function processElementSpecial(item) {
                    const img = new Image();
                    const thumb = new Image();
                    img.src = `https://boiling-citadel-14104.herokuapp.com/${item.dir}`;
                    thumb.src = `https://boiling-citadel-14104.herokuapp.com/${item.thumbnail}`;
                    imgCache.push({ dir: img, thumbnail: thumb, id: item.id, likes: item.likes });

                    img.addEventListener('load', () => {
                        loader.textContent = Number((loadedImgs / 3) * 100).toFixed(2) + '%';
                        console.log(loadedImgs);
                        if (loadedImgs === images.length - 1) {
                            console.log('imgcache: ', imgCache);
                            this.extractColors(imgCache).then(colors => {
                                const state = { isLoading: false, images: imgCache, colors, loadedPart: Number(n) };
                                this.setState(state);

                                this.setCurrentPartInNavigation();
                                console.log('just set state, n=', n)
                                setTimeout(() => loader.textContent = `0%`, 1500);
                            });
                        }
                        loadedImgs += 1;
                    });
                }

                function processElement(item) {
                    const img = new Image();
                    const thumb = new Image();
                    img.src = `https://boiling-citadel-14104.herokuapp.com/${item.dir}`;
                    thumb.src = `https://boiling-citadel-14104.herokuapp.com/${item.thumbnail}`;
                    imgCache.push({ dir: img, thumbnail: thumb, id: item.id, likes: item.likes });

                    img.addEventListener('load', () => {
                        loader.textContent = Number((loadedImgs / 26) * 100).toFixed(2) + '%';
                        console.log(loadedImgs);
                        if (loadedImgs === 26) {
                            console.log('imgcache: ', imgCache);
                            this.extractColors(imgCache).then(colors => {
                                const state = { isLoading: false, images: imgCache, colors, loadedPart: Number(n) };
                                this.setState(state);

                                this.setCurrentPartInNavigation();
                                console.log('just set state, n=', n)
                                setTimeout(() => loader.textContent = `0%`, 1500);
                            });
                        }
                        loadedImgs += 1;
                    });
                }

            });
    }

    extractColors(fetchedImages) {
        const mapImages = () => new Promise((res, rej) => {
            let colorArray = [];
            let count = 0;

            fetchedImages.forEach((item, i) => {
                Vibrant.from(item.dir.src)
                    .getPalette().then(result => {
                        const rgb = result.DarkMuted._rgb.join(', ');
                        colorArray.push({ i, rgb });

                        if (count === fetchedImages.length - 1) {
                            console.log(colorArray);
                            //colorArray = colorArray.sort((a, b) => a.i - b.i);
                            //const images = fetchedImages.map((item2, idx) => {
                            //    console.log(idx);
                            //    return Object.assign(item2, { color: colorArray[idx].rgb });
                            // });
                            res(colorArray.sort((a, b) => a.i - b.i));
                        }
                        count += 1;
                    }).catch(err => console.log(err));
            });
        });

        return mapImages();
    }

    setLikes() {
        //console.log('got_likes :' + this.model.state.currentImage, this.model.state.loadedPart);
        const { currentImage, loadedPart } = this.model.state;
        const url = `https://boiling-citadel-14104.herokuapp.com/likes/new/${loadedPart}/${currentImage}`;

        this.ajax.post(url).then(resp => JSON.parse(resp)).then(info => {
            const { images } = this.model.state;
            images[Number(currentImage)].likes = info.likes;

            this.setState({ images });
        });
    }

    setCurrentPartInNavigation() {
        const { loadedPart } = this.model.state;
        const parts = ['One', 'Two', 'Three', 'Four'];

        if (Number(loadedPart) !== 5) document.getElementById('js-header-part').innerHTML = `Part ${parts[Number(this.model.state.loadedPart) - 1]} /`;
    }
}