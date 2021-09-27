export class Loadings {

    body = null ;

    constructor(
    ){
        this.initBody();
    }

    initBody(){
        this.body = document.getElementsByClassName('body-main')[0];
    }

    /**
     * loading框
     */
    loadingShow(){
        this.hide();
        if(!this.body){ this.initBody() }

        let DOM = `<div class="loadings">
                        <div class="loadings-content">
                            <div class='loadings-loading'></div>
                        </div>
                   </div>`;
        let popups = document.createElement('div');
        popups.className = 'popups loading';
        popups.innerHTML = DOM;
        this.body.appendChild(popups);
    }


    hide(){
        if(!this.body){ this.initBody() }

        let popups = document.getElementsByClassName('popups');
        if(popups && popups.length > 0){
            for(let i=0; i<popups.length; i++){
                this.body.removeChild(popups[i]);
            }
        }
    }

    hideLoading(){
        if(!this.body){ this.initBody() }

        let popups = document.getElementsByClassName('loading');
        if(popups && popups.length > 0){
            for(let i=0; i<popups.length; i++){
                this.body.removeChild(popups[i]);
            }
        }
    }
}
