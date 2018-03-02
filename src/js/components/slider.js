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
        document.querySelector('.c-image_list').addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('c-button-drag')) this.enableResizableSlider(e);
        });

    }

    populateDOM() {
        const { loadedPart } = this.model.state;

        if (Number(loadedPart) !== 5) {

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

            this.setState({ currentPart: Number(loadedPart), currentImage: 1 });
            this.setBackground(true, true);
            this.generateThumbnailNavigation();
            this.stopStartSlider();
        }

        else {
            const li = document.createElement('li');
            li.setAttribute('class', " c-image_item");
            li.setAttribute('data-key', 0);

            let i = 0;
            while (i !== 2) {
                const div = document.createElement('div');
                div.setAttribute('class', "c-imagediv");
                div.style.backgroundImage = `url(${this.model.state.images[i].dir.src})`;
                if (i === 1) {
                    const span = document.createElement('span');
                    span.setAttribute('class', 'c-button-drag');
                    div.appendChild(span);
                }
                li.appendChild(div);
                i += 1;
            }
            //const addClass = (idx > 0 && idx < ar.length - 1) ? "" : ((idx === 0) ? "active" : "back");
            //JUST REPLACE IMAGES
            document.querySelector('.c-slider ul').innerHTML = "";
            document.querySelector('.c-slider ul').appendChild(li);
            // document.querySelector('.c-slider_resize').classList.add('is-open');
            document.querySelector('.c-slider_navigation-overlay').classList.remove('is-open');

            this.setState({ currentPart: Number(this.model.state.loadedPart), currentImage: 1 });
            this.setBackground(true, true);
            this.generateThumbnailNavigation();
        }
    }

    generateThumbnailNavigation() {
        const thumbGallery = document.createDocumentFragment();
        const isEven = n => !(n % 2);
        const { loadedPart } = this.model.state;

        this.model.state.images.map((item, i) => {
            if ((Number(loadedPart) !== 5) || ((Number(loadedPart) == 5) && (!isEven(i)))) {
                const li = document.createElement('li');
                li.classList.add('c-navigation_item');
                li.setAttribute('data-key', i);
                li.innerHTML = `<img alt="" src=${item.thumbnail.src}>`;

                const cover = document.createElement('div');
                cover.classList.add('c-navigation_button');

                li.appendChild(cover);
                thumbGallery.appendChild(li);
            }
        });

        document.querySelector('.c-slider_navigation-thumbnails ul').innerHTML = "";
        document.querySelector('.c-slider_navigation-thumbnails ul').appendChild(thumbGallery);
        document.querySelector('.c-slider_navigation-thumbnails .c-navigation_button').classList.add('is-active');
    }

    handleThumbNavClick(e) {
        const { loadedPart } = this.model.state;
        const idx = e.target.parentElement.dataset.key;

        if (Number(loadedPart) === 5) {
            document.querySelectorAll('.c-slider .c-image_list .c-imagediv')[0].style.backgroundImage = `url(${this.model.state.images[idx - 1].dir.src})`;
            document.querySelectorAll('.c-slider .c-image_list .c-imagediv')[1].style.backgroundImage = `url(${this.model.state.images[idx].dir.src})`;
            document.querySelectorAll('.c-slider .c-image_list .c-imagediv')[1].style.width = `50%`;

            this.setState({ currentImage: ((Number(idx) + 1) / 2) - 1 });
            this.setActiveThumbnail();
            this.getSlideNumber();

        }
        else {
            document.querySelector('.c-slider .active').classList.remove('active')
            document.querySelectorAll('.c-image_item')[idx].classList.add('active');

            this.setState({ currentImage: Number(document.querySelector('.c-slider .active').dataset.key) });
            this.setActiveThumbnail();
            this.getSlideNumber();
            this.getLikes();
        }
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

    enableResizableSlider(e) {
        console.log('just get called');
        window.addEventListener('mousemove', startResizing);
        window.addEventListener('mouseup', stopResizing);

        function startResizing(e) {
            console.log('startresizing');
            const div = document.querySelectorAll('.c-slider .c-image_list .c-imagediv')[1];

            let dim = e.clientX - div.offsetLeft;
            if (dim >= 0 && dim <= 800) div.style.width = (e.clientX - div.offsetLeft) + 'px';
        }

        function stopResizing() {
            console.log('stopped resizing');

            window.removeEventListener('mousemove', startResizing);
            window.removeEventListener('mouseup', stopResizing);
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
        if (Number(this.model.state.loadedPart) !== 5) switch (e.keyCode) {
            case 39: this.nextSlide(); break;
            case 37: this.prevSlide(); break;
            case 32: this.stopStartSlider(); break;
            //TODO resize,navigation                
        }
    }

    render() {
        if (!this.model.state.isLoading && (this.model.state.currentPart !== this.model.state.loadedPart)) this.populateDOM();
        console.log('just rerendered.'); //if (this.model.state.isSliderRunning) this.stopStartSlider();
    }
}