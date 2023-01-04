import {Component} from '@angular/core';
import {interval} from 'rxjs';
import {AlertController, Platform} from '@ionic/angular';
import {Plugins} from '@capacitor/core';

const {Storage} = Plugins;

// noinspection JSIgnoredPromiseFromCall
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    text = 'Breathe In';
    containerClass = 'container';
    totalTime = 12000;
    breatheTime = 4000;
    holdTime = 4000;
    subscription: any;

    constructor(private alertCtrl: AlertController,
                private platform: Platform) {
        this.getString('isAlertShown').then((data: any) => {
            if (!(data && data.value === '1')) {
                this.presentAlert();
            }
        });
        this.breatheAnimation();
        interval(this.totalTime).subscribe(() => this.breatheAnimation());
    }

    ionViewDidEnter() {
        this.subscription = this.platform.backButton.subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    ionViewWillLeave() {
        this.subscription.unsubscribe();
    }

    async presentAlert() {
        const alert = await this.alertCtrl.create({
            mode: 'ios',
            header: 'Welcome to BreatheIN',
            message: 'Just relax and focus on your breathe to feel better.',
            buttons: [{
                text: 'Ok',
                handler: () => {
                    this.setString('isAlertShown', '1');
                }
            }]
        });
        await alert.present();
    }

    breatheAnimation() {
        this.text = 'Breathe In!';
        this.containerClass = 'container grow';

        setTimeout(() => {
            this.text = 'Hold';
            setTimeout(() => {
                this.text = 'Breathe Out!';
                this.containerClass = 'container shrink';
            }, this.holdTime);
        }, this.breatheTime);
    }

    async setString(key: string, value: string) {
        await Storage.set({key, value});
    }

    async getString(key: string): Promise<{ value: any }> {
        return (await Storage.get({key}));
    }

}
