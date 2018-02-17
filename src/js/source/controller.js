import Ajax from '../helpers/ajax';

export default class Controller {
    constructor(model) {
        this.model = model;
        this.state = this.model.state;
        this.ajax = new Ajax();

        this.init(1);
        //setTimeout(() => document.querySelector('.c-main_preloader').classList.remove('is-open'), 1000);
    }

    handleEvent() { }

    init(n) {
        const imgCache = [];
        let loadedImgs = 0;
        const loader = document.querySelector('.c-preloader_text');

        this.ajax.get(`https://boiling-citadel-14104.herokuapp.com/static/img/${n}`)
            .then(data => JSON.parse(data)).then(({ images }) => {

                images.forEach(processElement.bind(this));

                function processElement(el) {
                    const img = new Image();
                    img.src = `https://boiling-citadel-14104.herokuapp.com/${el.dir}`;
                    imgCache.push(img);

                    img.addEventListener('load', () => {
                        loadedImgs += 1;
                        loader.textContent = Number((loadedImgs / 27) * 100).toFixed(2) + '%';
                        if (loadedImgs === 27) {
                            this.model.setState({ isLoading: false, images: imgCache });
                        }
                    });
                }

            });
    }
}