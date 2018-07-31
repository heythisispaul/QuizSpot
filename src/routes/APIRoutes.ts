import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import SongChoices, { ITitleOptions } from '../HelperFunctions/SongChoices';
import { resolve } from 'dns';
import { rejects } from 'assert';

        //my userid: 1298920342
        //big playlist id: 4s26grp0g03iAJfWgUOwZF

export class APIRoutes {

    public routes = (app): void => {

        app.route('/myplaylist').post((req: Request, res: Response) => {
            //eventually this will take the user and playlist as params
            let token: string = req.body.data.token;
            let endPoint: string = "https://api.spotify.com/v1/users/1298920342/playlists/4s26grp0g03iAJfWgUOwZF/tracks";
            let songList: Array<any> = [];
            this.getSongs(endPoint, token, songList)
            .then((next) => {
                if (next.next) {
                    this.getSongs(next.next, token, songList)
                    .then(() => {
                        res.send(this.getFalseSongs(songList));
                    });
                }
                else {
                    res.send(this.getFalseSongs(songList));
                }
            })
            .catch((err: Error) => {
                console.log(err);
            })
        })

        app.route('/meow').get((req, res) => {
            res.send("heyyyy");
        })
    } 

    public randomNumber = (max?: number): number => {
        return Math.floor((Math.random() * max ? max : 99));
    }

    public options = (token: string): Object => {
        return (
            {
                headers: {
                    "Authorization" : "Bearer " + token
                }
            }
        )
    }

    public getSongs = (endPoint, token, songList): Promise<any> => {
        return new Promise<any>((resolve, reject) => {
            axios.get(endPoint, this.options(token))
            .then((response: AxiosResponse) => {
                let songs = response.data.items;
                songs.forEach(song => {
                    if (song.track.preview_url) {
                        songList.push(new SongChoices(
                            song.track.preview_url,
                            song.track.name,
                            song.track.artists[0].name,
                            [{ title: song.track.name, correct: true }],
                            song.track.album.images[0].url
                        ));
                    }
                });
                resolve(response.data);
            })
        })
    }

    public randomize = (songList: Array<any>): any => {
        let starterIndex: number = songList.length, randomIndex, tempValue;
        while (0 !== starterIndex) {
            randomIndex =  Math.floor(Math.random() * starterIndex);
            starterIndex -= 1;

            tempValue = songList[starterIndex];
            songList[starterIndex] = songList[randomIndex];
            songList[randomIndex] = tempValue;
        }
        return songList;
    }

    public getFalseSongs = (songList: Array<SongChoices>): Array<SongChoices> => {
            this.randomize(songList);
            let rando: number; 
            songList.forEach(song => {
            let match: boolean;
            while (song.Options.length < 5) {
                rando = Math.floor(Math.random() * songList.length);
                song.Options.forEach(option => {
                    match = false;
                    if (songList[rando].Title == option.title) {
                        match = true;
                    }
                });
                if (!match) {
                    song.Options.push({
                        title: songList[rando].Title,
                        correct: false
                    });
                }
            }
            this.randomize(song.Options);
        });
        return songList;
    }
}