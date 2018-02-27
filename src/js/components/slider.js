import View from '../source/view';

export default class Slider extends View {
    constructor(model, controller) {
        super(model, controller);
    }

    attachHandlers() {
        document.getElementById('js-prev').addEventListener('click', this.prevSlide.bind(this));
        document.getElementById('js-next').addEventListener('click', this.nextSlide.bind(this));
        document.getElementById('js-stop-start').addEventListener('click', this.stopStartSlider.bind(this));
        document.getElementById('js-download').addEventListener('click', this.getFullImage.bind(this));
        document.getElementById('js-likes').addEventListener('click', this.setLike.bind(this));

        document.querySelector('.c-slider_navigation-thumbnails ul').addEventListener('click', (e) => {
            if (e.target.classList.contains('c-navigation_button')) this.handleThumbNavClick(e);
        });

        document.addEventListener('keydown', (e) => this.enableKeys(e));
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

        this.setState({ currentPart: Number(this.model.state.loadedPart), currentImage: 1 });
        this.setBackground(true, true);
        this.generateThumbnailNavigation();
        this.stopStartSlider();
    }

    generateThumbnailNavigation() {
        const thumbGallery = document.createDocumentFragment();

        this.model.state.images.map((item, i) => {
            const li = document.createElement('li');
            li.classList.add('c-navigation_item');
            li.setAttribute('data-key', i);
            li.innerHTML = `<img alt="" src=${item.thumbnail.src}>`;

            const cover = document.createElement('div');
            cover.classList.add('c-navigation_button');

            li.appendChild(cover);
            thumbGallery.appendChild(li);
        });

        document.querySelector('.c-slider_navigation-thumbnails ul').innerHTML = "";
        document.querySelector('.c-slider_navigation-thumbnails ul').appendChild(thumbGallery);
        document.querySelector('.c-slider_navigation-thumbnails .c-navigation_button').classList.add('is-active');
    }

    handleThumbNavClick(e) {
        document.querySelector('.c-slider .active').classList.remove('active')
        document.querySelectorAll('.c-image_item')[e.target.parentElement.dataset.key].classList.add('active');

        this.setState({ currentImage: Number(document.querySelector('.c-slider .active').dataset.key) });
        this.setActiveThumbnail();
        this.getSlideNumber();
        this.getLikes();
    }

    setActiveThumbnail() {
        document.querySelector('.c-slider_navigation-thumbnails .is-active').classList.remove('is-active');
        document.querySelectorAll('.c-slider_navigation-thumbnails .c-navigation_item')[this.model.state.currentImage].lastElementChild.classList.add('is-active');
    }

    nextSlide() {
        const imageList = document.querySelectorAll('.c-image_item');

        if (imageList[imageList.length - 1].classList.contains('active')) imageList[0].classList.add('active');
        else document.querySelector('.c-slider .active').nextElementSibling.classList.add('active');

        if ((document.querySelectorAll('.c-slider .active').length > 1) && (!(imageList[0].classList.contains('active') && imageList[imageList.length - 1].classList.contains('active')))) document.querySelector('.c-slider .active').classList.remove('active');
        else if (document.querySelectorAll('.c-slider .active').length > 1) imageList[imageList.length - 1].classList.remove('active');
        document.querySelector('.c-slider .back').classList.remove('back');

        if (imageList[1].classList.contains('active')) imageList[0].classList.add('back');
        else if (imageList[0].classList.contains('active')) imageList[imageList.length - 1].classList.add('back');
        else document.querySelector('.c-slider .active').previousElementSibling.classList.add('back');

        this.setState({ currentImage: Number(document.querySelector('.c-slider .active').dataset.key) });
        this.setBackground(true);
        this.setActiveThumbnail();
        this.getSlideNumber();
        this.getLikes()
    }

    prevSlide() {
        const imageList = document.querySelectorAll('.c-slider .c-image_item');

        if (imageList[imageList.length - 1].classList.contains('back') && (imageList[0].classList.contains('active'))) {
            document.querySelector('.c-slider .back').classList.add('active');
            document.querySelector('.c-slider .back').classList.remove('back');
            document.querySelector('.c-slider .active').classList.add('back');
            document.querySelector('.c-slider .active').classList.remove('active');
        }
        else if (imageList[0].classList.contains('active')) {
            document.querySelector('.c-slider .active').nextElementSibling.classList.remove('back');
            imageList[imageList.length - 1].classList.add('active');
            imageList[0].classList.remove('active');
            imageList[0].classList.add('back');
        }
        else {
            document.querySelector('.c-slider .active').previousElementSibling.classList.add('active');
            document.querySelector('.c-slider .back').classList.remove('back');
            document.querySelector('.c-slider .active').nextElementSibling.classList.remove('active');
            document.querySelector('.c-slider .active').nextElementSibling.classList.add('back');
        }

        this.setState({ currentImage: Number(document.querySelector('.c-slider .active').dataset.key) });
        this.setBackground(false);
        this.setActiveThumbnail();
        this.getSlideNumber();
        this.getLikes();
    }

    stopStartSlider() {
        (this.model.state.isSliderRunning) ? (this.setState({ isSliderRunning: false }), clearInterval(window.sliderInterval)) : (this.setState({ isSliderRunning: true }), window.sliderInterval = setInterval(() => document.getElementById('js-next').click(), this.model.state.interval));
        const stopStartButtonDOM = document.getElementById('js-stop-start').firstElementChild;
        (this.model.state.isSliderRunning) ? stopStartButtonDOM.innerHTML = "stop" : stopStartButtonDOM.innerHTML = "play_arrow";
    }

    stopSlider() {
        if (this.model.state.isSliderRunning) {
            this.setState({ isSliderRunning: false });
            clearInterval(window.sliderInterval);
            document.getElementById('js-stop-start').firstElementChild.innerHTML = "play_arrow";
        }
    }

    setBackground(slideDirectionFlag, startMode = false) {
        const backgroundList = document.querySelectorAll('.l-main_page-background');
        const imageList = document.querySelectorAll('.c-slider_image .c-image_list li');

        if (startMode) {
            document.querySelector('.c-background_list .active').style.background = `linear-gradient(to top, #232526,rgb(${this.model.state.colors[0].rgb})`;
            return 0;
        }

        //next
        if (slideDirectionFlag) {
            if (backgroundList[backgroundList.length - 1].classList.contains('active')) backgroundList[0].classList.add('active');
            else document.querySelector('.c-background_list .active').nextElementSibling.classList.add('active');
            if ((document.querySelectorAll('.c-background_list .active').length > 1) && (!(backgroundList[0].classList.contains('active') && backgroundList[backgroundList.length - 1].classList.contains('active')))) document.querySelector('.c-background_list .active').classList.remove('active');
            else if (document.querySelectorAll('.c-background_list .active').length > 1) backgroundList[backgroundList.length - 1].classList.remove('active');
            document.querySelector('.c-background_list .back').classList.remove('back');
            if (backgroundList[1].classList.contains('active')) backgroundList[0].classList.add('back');
            else if (backgroundList[0].classList.contains('active')) backgroundList[backgroundList.length - 1].classList.add('back');
            else document.querySelector('.c-background_list .active').previousElementSibling.classList.add('back');

            const idx = Array.from(imageList).indexOf(document.querySelector('.c-slider_image .c-image_list .active'));

            document.querySelector('.c-background_list .active').style.background = `linear-gradient(to top, #232526,rgb(${this.model.state.colors[idx].rgb})`;
        }

        //back
        else {
            if (backgroundList[backgroundList.length - 1].classList.contains('back') && (backgroundList[0].classList.contains('active'))) {
                document.querySelector('.c-background_list .back').classList.add('active');
                document.querySelector('.c-background_list .back').classList.remove('back');
                document.querySelector('.c-background_list .active').classList.add('back');
                document.querySelector('.c-background_list .active').classList.remove('active');
            }
            else if (backgroundList[0].classList.contains('active')) {
                document.querySelector('.c-background_list .active').nextElementSibling.classList.remove('back');
                backgroundList[backgroundList.length - 1].classList.add('active');
                backgroundList[0].classList.remove('active');
                backgroundList[0].classList.add('back');
            }
            else {
                document.querySelector('.c-background_list .active').previousElementSibling.classList.add('active');
                document.querySelector('.c-background_list .back').classList.remove('back');
                document.querySelector('.c-background_list .active').nextElementSibling.classList.remove('active');
                document.querySelector('.c-background_list .active').nextElementSibling.classList.add('back');
            }
            const idx = Array.from(imageList).indexOf(document.querySelector('.c-slider_image .c-image_list .active'));

            document.querySelector('.c-background_list .active').style.background = `linear-gradient(to top, #232526,rgb(${this.model.state.colors[idx].rgb})`;
        }
    }

    getFullImage(e) {
        window.open(document.querySelector('.c-slider .active').firstElementChild.getAttribute('src'));
    }

    getSlideNumber() {
        document.querySelector('.c-sliderinfo_number span').innerHTML = Number(this.model.state.currentImage) + 1;
    }

    getLikes() {
        document.querySelector('.c-sliderinfo_likes span').innerHTML = this.model.state.images[this.model.state.currentImage].likes;
    }

    setLike() {
        this.controller.setLikes();

        let likes = document.querySelector('.c-sliderinfo_likes span').innerHTML;
        document.querySelector('.c-sliderinfo_likes span').innerHTML = Number(likes) + 1;
    }

    enableKeys(e) {
        switch (e.keyCode) {
            case 39: this.nextSlide(); break;
            case 37: this.prevSlide(); break;
            case 32: this.stopStartSlider(); break;
            //TODO resize                
        }
    }

    render() {
        if (!this.model.state.isLoading && (this.model.state.currentPart !== this.model.state.loadedPart)) this.populateDOM();
        console.log('just rerendered.'); //if (this.model.state.isSliderRunning) this.stopStartSlider();
    }
}