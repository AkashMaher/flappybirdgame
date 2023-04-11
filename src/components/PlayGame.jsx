import React from 'react';
import '../styles/game.css';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APIURL
const contract = import.meta.env.VITE_CONTRACT
const ApiKey = import.meta.env.VITE_DEV_API
const DevAddress= import.meta.env.VITE_DEV_ADDRESS

const PlayGame = () => {

    let account_address = localStorage.getItem('account')

    const navigate = useNavigate();
    let { account, selectedAsset } = useGlobalContext();
    let CacheImage = localStorage.getItem('selectedImage')
    const [high_score,setHighScore] = useState(0)

    useEffect(()=> {
        let highScore = localStorage.getItem('highScore')
        setHighScore(highScore)
    })

    selectedAsset === undefined && CacheImage ? selectedAsset = CacheImage: selectedAsset === undefined ? selectedAsset='images/bird1.png' : null;


    // Auto Mint Function


    const handleMint = async () => {
        let score = localStorage.getItem('score');
        let token_id = [];
        if(score>=110) {
            token_id.push(4)
        } 
        if(score>=80) {
            token_id.push(3)
        }
        if(score>=55) {
            token_id.push(2)
        }
        if(score>=35) {
            token_id.push(1)
        }
        if(score>=20) {
            token_id.push(0)
        }
    
        for(let i = 0;i<token_id.length;i++){
            let tokenId = token_id[i]
            const tokens = await axios.get(`${baseUrl}/nft/g2w3-1155/get-tokens/${account?account:account_address}/${contract}/${tokenId}`);

        // console.log(tokens?.data?.number_of_tokens?.tokens)
            if(tokens?.data?.number_of_tokens?.tokens !== undefined && tokens?.data?.number_of_tokens?.tokens>0 && score>=5) return console.log('already unlocked')

            const mintObject = {
                wallet_address: DevAddress,
                contract_address: contract,
                token_owner: account?account:account_address,
                token_id:tokenId,
                number_of_tokens:1,
                name:'',
                image_uri: '',
                description:'',
                external_uri: '',
                attributes:[]
            };
            // console.log(mintObject)
            // console.log("From UPLOAD FILE", { account, apiKey, mintObject });

            const mintApi = `${baseUrl}/nft/mint-1155`;
            const response = await axios.post(mintApi, mintObject, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-HEADER': ApiKey
                }
            })
            console.log('unlocking new bird ', tokenId)
        }
    
    //   console.log(response);
    //   navigate("/", { replace: true });

   };



    let move_speed, gravity, sound_point,
        sound_die, bird_props,
        background,
        score_val,
        message,
        score_title,
        game_state, bird
        ;
    let img;
    let bird_dy = 0;
    let pipe_seperation = 0;
    let pipe_gap = 55;

    const [imageUrl, setImageUrl] = useState('images/bird1.png');
    console.log(selectedAsset);
    useEffect(() => {
        const fetchImage = async () => {
            const response = await fetch(selectedAsset);
            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setImageUrl(objectUrl?objectUrl:'images/bird1.png');
        };

        fetchImage();
    }, []);





    useEffect(() => {

        move_speed = 3, gravity = 0.5;
        bird = document.querySelector('.bird');
        // console.log("bird",bird);
        img = document.querySelector('.bird');
        sound_point = new Audio('sounds effect/point.mp3');
        sound_die = new Audio('sounds effect/die.mp3');

        // getting bird element properties
        bird_props = bird.getBoundingClientRect();

        // This method returns DOMReact -> top, right, bottom, left, x, y, width and height
        background = document.querySelector('.background').getBoundingClientRect();

        score_val = document.querySelector('.score_val');
        message = document.querySelector('.message');
        score_title = document.querySelector('.score_title');

        game_state = 'Start';
        //  console.log("image",img);
        img.classList.add('disp_none');
        message.classList.add('messageStyle');


        document.addEventListener('keydown', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/bird1.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = 'images/bird1.png';
            }
        });

    }, [game_state]);


    document.addEventListener('keydown', (e) => {
        score_val = document.querySelector('.score_val');
        score_title = document.querySelector('.score_title');


        bird = document.querySelector('.bird');
        img = document.querySelector('.bird');
        message = document.querySelector('.message');
        if (e.key == 'Enter' && game_state != 'Play') {
            document.querySelectorAll('.pipe_sprite').forEach((e) => {
                e.remove();
            });
            img.classList.remove('disp_none');
            img.classList.add('disp_block');
            bird.style.top = '40vh';
            game_state = 'Play';
            message.innerHTML = '';
            score_title.innerHTML = 'Score : ';
            score_val.innerHTML = '0';
            message.classList.remove('messageStyle');
            play()
        }
    });



    useEffect(() => {
        console.log(game_state);

        function create_pipe() {
            // if (game_state != 'Play') return;

            if (pipe_seperation > 115) {
                pipe_seperation = 0;

                let pipe_posi = Math.floor(Math.random() * 43) + 8;
                let pipe_sprite_inv = document.createElement('div');
                pipe_sprite_inv.className = 'pipe_sprite';
                pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
                pipe_sprite_inv.style.left = '100vw';

                document.body.appendChild(pipe_sprite_inv);
                let pipe_sprite = document.createElement('div');
                pipe_sprite.className = 'pipe_sprite';
                pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
                pipe_sprite.style.left = '100vw';
                pipe_sprite.increase_score = '1';

                document.body.appendChild(pipe_sprite);
            }

            pipe_seperation++;
            requestAnimationFrame(create_pipe);
        }
        requestAnimationFrame(create_pipe);

    }, [game_state]);


    function play() {
        function move() {
            if (game_state != 'Play') return;

            let pipe_sprite = document.querySelectorAll('.pipe_sprite');
            pipe_sprite.forEach((element) => {
                let pipe_sprite_props = element.getBoundingClientRect();
                bird_props = bird.getBoundingClientRect();

                if (pipe_sprite_props.right <= 0) {
                    element.remove();
                } else {
                    if (bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top) {
                        game_state = 'End';
                        message.innerHTML = 'Game Over' + '<br>Press Enter To Restart';
                        message.classList.add('messageStyle');
                        img.style.display = 'none';
                        handleMint();
                        // sound_die.play();
                        return;
                    } else {
                        if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                            score_val.innerHTML = + score_val.innerHTML + 1;
                            // console.log(score_val.innerHTML)
                            localStorage.setItem('score', parseInt(score_val.innerHTML))
                            let highScore = localStorage.getItem('highScore');
                            setHighScore(highScore)
                            if(highScore && highScore>=parseInt(score_val.innerHTML)) {

                            } else {
                                localStorage.setItem('highScore', parseInt(score_val.innerHTML))
                            }
                            highScore = localStorage.getItem('highScore');
                            setHighScore(highScore)
                            // console.log(highScore)
                            // sound_point.play();
                        }
                        element.style.left = pipe_sprite_props.left - move_speed + 'px';
                    }
                }
            });
            requestAnimationFrame(move);
        }
        requestAnimationFrame(move);


        function apply_gravity() {
            background = document.querySelector('.background').getBoundingClientRect();
            bird = document.querySelector('.bird');
            // getting bird element properties
            bird_props = bird.getBoundingClientRect();

            if (game_state != 'Play') return;
            bird_dy = bird_dy + gravity;
            document.addEventListener('keydown', (e) => {
                if (e.key == 'ArrowUp' || e.key == ' ') {
                    img.src = imageUrl
                        ;
                    bird_dy = -7.6;
                }
            });

            document.addEventListener('keyup', (e) => {
                if (e.key == 'ArrowUp' || e.key == ' ') {
                    img.src = imageUrl;
                }
            });

            if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
                game_state = 'End';
                // message.style.left = '28vw';
                console.log("HIT BOTTOM");
                // alert("GAME OVER");
                message.classList.remove('messageStyle');
                handleMint();
                return;
                navigate('/', { replace: true })
            }
            bird.style.top = bird_props.top + bird_dy + 'px';
            bird_props = bird.getBoundingClientRect();
            requestAnimationFrame(apply_gravity);
        }
        requestAnimationFrame(apply_gravity);
    }
    return (
        <div>
            <div className="background"></div>
            {/* <>{account}</> */}
            <img src="images/bird1.png" alt="bird-img" className="bird" id="bird-1" />
            <div className="message">
                Enter To Start Game <p>
                    <span>&uarr;</span> ArrowUp to Control</p>
            </div>
            <div className="score">
                <div className='highScore'>{`High Score: ${high_score}`}</div>
                <div className="score_title"></div>
                <div className="score_val"></div>

            </div>
        </div>
    )
}

export default PlayGame