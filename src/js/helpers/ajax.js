export default class Ajax {
    get(url) {
        const xhr = this.xhr ? this.xhr : new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.send();

        return (() => new Promise((res, rej) => xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) res(xhr.responseText);
        }))();
    }

    post(url, options) {
        const xhr = this.xhr ? this.xhr : new XMLHttpRequest();

        xhr.open('POST', url, true);
        xhr.send();

        return (() => new Promise((res, rej) => xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) res(xhr.responseText);
        }))();
    }
}