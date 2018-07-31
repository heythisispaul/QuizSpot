import { Request, Response } from 'express';
import WebConfig from '../WebConfig';
import axios, { AxiosResponse } from 'axios';
import * as path from 'path';

export class OAuthRoutes {

    redirectURI: string;
    spotifyScopes: string;
    token: string;
    state: string;

    constructor() {
        this.redirectURI = 'http://localhost:3000/redirected';
        this.token = '';
        this.state = this.StateGen();
    }

    private StateGen = (): string => {
        let state: string = '';
        let chars: string = 'abcdefghijklmnopqrstuvwxyz0123456789';
        while (state.length < 10) {
            state += chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
        }
        return state;
    }

    public routes = (app): void => {
        app.route('/')
        .get((req: Request, res: Response) => {
            res.status(200).send({
                messaage: 'GET request Successful my dude!'
            });
        })

        app.route('/login')
        .get((req: Request, res: Response) => {
            res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${WebConfig.spotify.ClientId}&redirect_uri=${encodeURIComponent(this.redirectURI)}&state=${this.state}`);
        })

        app.route('/redirected')
        .get((req: Request, res: Response) => {
            let authorization = "Basic " + Buffer.from(WebConfig.spotify.ClientId + ":" + WebConfig.spotify.Secret).toString('base64');
            let bodyString = "grant_type=authorization_code&redirect_uri=" + this.redirectURI + "&code=" + req.query.code;
            if (req.query.state == this.state) {
                axios({
                    method: 'POST',
                    url: 'https://accounts.spotify.com/api/token',
                    headers: {
                        "Authorization": authorization,
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: bodyString
                })
                .then((response: AxiosResponse) => {
                    if (response.status == 400) {
                        console.log("uh oh");
                    }
                    let token: string = response.data.access_token;
                    res.redirect('/token=' + token);
                })   
            }  
            else {
                res.status(400);
                res.send("There was an error validating your request");
            }       
        });

        app.route('/loggedin/:token').get((req: Request, res: Response) => {
            let token: string = req.params.token;
            axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
            .then((response: AxiosResponse) => {
                res.send( { data: response.data} );
            })
        })

        app.route('/token=:token')
        .get((req: Request, res: Response) => {
            res.sendFile(path.join(__dirname, '../../token.html'));
        })

        app.route('/playlists')
        .get((req: Request, res: Response) => {
            console.log(this.token);
            axios.get('https://api.spotify.com/v1/me/playlists', {
                headers: {
                    "Authorization": "Bearer " + this.token
                }
            })
            .then((response: AxiosResponse) => {
                res.send( { data: response.data} );
            })
        })
    } 
}