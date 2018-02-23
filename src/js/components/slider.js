import View from '../source/view';

export default class Slider extends View {
    constructor(model, controller) {
        super(model, controller);
        //this.sliderInterval=setInterval(,3000);
    }

    attachHandlers() {
        document.getElementById('js-prev').addEventListener('click', this.prevSlide.bind(this));
        document.getElementById('js-next').addEventListener('click', this.nextSlide.bind(this));
        document.getElementById('js-stop-start').addEventListener('click', this.stopStartSlider.bind(this));
    }

    populateDOM() {
        const imageList = document.createDocumentFragment();

        this.model.state.images.map((item, i, ar) => {
            const li = document.createElement('li');
            const addClass = (i > 0 && i < ar.length - 1) ? "" : ((i === 0) ? "active" : "back");

            li.setAttribute('class', addClass + " c-image_item");
            li.setAttribute('data-key', i);
            li.innerHTML = `<img alt="" src=${item.dir.src}>`;

            imageList.appendChild(li);
        });

        document.querySelector('.c-slider ul').innerHTML = "";
        document.querySelector('.c-slider ul').appendChild(imageList);

        this.setState({ currentPart: Number(this.model.state.loadedPart) });
        this.generateThumbnailNavigation();
        this.stopStartSlider();
    }

    generateThumbnailNavigation() {
        const thumbGallery = document.createDocumentFragment();

        this.model.state.images.map(item => {
            const li = document.createElement('li');
            li.classList.add('c-navigation_item');
            li.innerHTML = `<img alt="" src=${item.thumbnail.src}>`;

            thumbGallery.appendChild(li);
        });

        document.querySelector('.c-slider_navigation-thumbnails ul').innerHTML = "";
        document.querySelector('.c-slider_navigation-thumbnails ul').appendChild(thumbGallery);
    }

    nextSlide() {
        const imageList = document.querySelectorAll('.c-image_item');

        if (imageList[imageList.length - 1].classList.contains('active')) imageList[0].classList.add('active');
        else document.querySelector('.active').nextElementSibling.classList.add('active');

        if ((document.querySelectorAll('.active').length > 1) && (!(imageList[0].classList.contains('active') && imageList[imageList.length - 1].classList.contains('active')))) document.querySelector('.active').classList.remove('active');
        else if (document.querySelectorAll('.active').length > 1) imageList[imageList.length - 1].classList.remove('active');
        document.querySelector('.back').classList.remove('back');

        if (imageList[1].classList.contains('active')) imageList[0].classList.add('back');
        else if (imageList[0].classList.contains('active')) imageList[imageList.length - 1].classList.add('back');
        else document.querySelector('.active').previousElementSibling.classList.add('back');

        this.setState({ currentImage: document.querySelector('.active').firstElementChild.getAttribute('src') });
    }

    prevSlide() {
        const imageList = document.querySelectorAll('.c-image_item');

        if (imageList[imageList.length - 1].classList.contains('back') && (imageList[0].classList.contains('active'))) {
            document.querySelector('.back').classList.add('active');
            document.querySelector('.back').classList.remove('back');
            document.querySelector('.active').classList.add('back');
            document.querySelector('.active').classList.remove('active');
        }
        else if (imageList[0].classList.contains('active')) {
            document.querySelector('.active').nextElementSibling.classList.remove('back');
            imageList[imageList.length - 1].classList.add('active');
            imageList[0].classList.remove('active');
            imageList[0].classList.add('back');
        }
        else {
            document.querySelector('.active').previousElementSibling.classList.add('active');
            document.querySelector('.back').classList.remove('back');
            document.querySelector('.active').nextElementSibling.classList.remove('active');
            document.querySelector('.active').nextElementSibling.classList.add('back');
        }
    }

    stopStartSlider() {
        (this.model.state.isSliderRunning) ? (this.setState({ isSliderRunning: false }), clearInterval(window.sliderInterval)) : (this.setState({ isSliderRunning: true }), window.sliderInterval = setInterval(() => document.getElementById('js-next').click(), this.model.state.interval));
        const stopStartButtonDOM = document.getElementById('js-stop-start').firstElementChild;
        (this.model.state.isSliderRunning) ? stopStartButtonDOM.innerHTML = "stop" : stopStartButtonDOM.innerHTML = "play_arrow";
    }

    stopSlider() {
        if (this.model.state.isSliderRunning) {
            this.setState({ isSliderRunning: false }); clearInterval(window.sliderInterval)
            document.getElementById('js-stop-start').firstElementChild.innerHTML = "play_arrow";;
        };
    }

    render() {
        if (!this.model.state.isLoading && (this.model.state.currentPart !== this.model.state.loadedPart)) this.populateDOM();
        console.log('just rerendered.');
        //if (this.model.state.isSliderRunning) this.stopStartSlider();
    }
}