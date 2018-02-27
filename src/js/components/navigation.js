import View from '../source/view';

export default class Navigation extends View {
    constructor(model, controller) {
        super(model, controller);

        //  this.preloader = document.querySelector('.c-main_preloader');
    }
    attachHandlers() {
        document.querySelector('.l-main_navigation').addEventListener('click', (e) => {
            if (e.target.classList.contains('c-navigation_button')) this.handleMainNavigationClick(e);
        });
    }

    fillMainNavWithThumbnails() {
        const imageNavList = document.createDocumentFragment();
        const { loadedPart, navThumbnails } = this.model.state;

        let i = 1;
        while (i <= 4) {
            if (i !== loadedPart) {
                const li = document.createElement('li');
                li.setAttribute('data-key', i);
                li.classList.add('c-navigation_item');
                navThumbnails[i - 1].forEach((item, idx) => {
                    const img = document.createElement('img');
                    //TODO is that loading 2 times?
                    img.src = item.src;
                    if (!idx) img.style.display = 'block';
                    li.appendChild(img);
                });

                const cover = document.createElement('div');
                cover.classList.add('c-navigation_button');
                cover.innerHTML = `<span>${i}</span>`;
                li.appendChild(cover);

                imageNavList.appendChild(li);
            }
            i += 1;
        }
        //<li data-key="2" class="c-navigation_item"></li>
        document.querySelector('.l-main_navigation .c-navigation_list').innerHTML = "";
        document.querySelector('.l-main_navigation .c-navigation_list').appendChild(imageNavList);
    }

    handleMainNavigationClick(e) {
        console.log(e.target.parentElement.dataset.key);
        this.controller.fetchImages(e.target.parentElement.dataset.key);

        document.querySelector('.l-main_page').classList.remove('h-noanim');
        document.querySelector('.l-main_navigation').classList.remove('h-noanim');

        document.querySelector('.l-main_page').classList.remove('is-open');
        document.querySelector('.js-navigation_button-full').classList.remove('is-open');
        document.querySelector('.l-main_navigation').classList.remove('is-open');
        this.setState({ isNavOpen: false, isLoadingNewPart: true });

        document.querySelector('.c-mainpage_preloader').classList.add('is-open');
    }

    render() {
        if (!this.model.state.isLoading) document.querySelector('.c-mainpage_preloader').classList.remove('is-open');
        if (this.model.state.navThumbnails.length && !this.model.state.isLoading && (this.model.state.currentPart !== this.model.state.loadedPart)) this.fillMainNavWithThumbnails();
    }
}
