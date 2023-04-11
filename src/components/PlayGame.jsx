import React from 'react';
import '../styles/game.css';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { local } from 'web3modal';

const baseUrl = import.meta.env.VITE_APIURL
const contract = import.meta.env.VITE_CONTRACT
const ApiKey = import.meta.env.VITE_DEV_API
const DevAddress= import.meta.env.VITE_DEV_ADDRESS
const GameBackend = import.meta.env.VITE_BACKEND

const PlayGame = () => {

    let account_address = localStorage.getItem('account')

    const navigate = useNavigate();
    let { account, selectedAsset } = useGlobalContext();
    let CacheImage = localStorage.getItem(`${account?account:account_address}-selectedImage`)
    const [high_score,setHighScore] = useState(0)
    const [txnProcessing,setTxnState] = useState(false)

    useEffect(()=> {
        let highScore = localStorage.getItem(`${account?account:account_address}-highScore`)
        setHighScore(highScore)
    })

    selectedAsset === undefined && CacheImage ? selectedAsset = CacheImage: selectedAsset === undefined ? selectedAsset='images/bird1.png' : null;


    // Auto Mint Function


    const handleMint = async () => {
        let score = localStorage.getItem(`${account?account:account_address}-score`);
        let token_id = [];
        if(score>=50) {token_id = [0,1,2,3,4]} 
        else if(score>=30) {token_id = [0,1,2,3]}
        else if(score>=20) {token_id =[0,1,2]}
        else if(score>=10) {token_id=[0,1]}
        else if(score>=5) {token_id=[0]}
    
        

        console.log(token_id)
        
        for(let i = 0;i<token_id.length;i++){
            await mint(token_id[i])
        // return
        }
        return ;


   };

   let mint = async (tokenId)=> {
    if(!account && !account_address) return console.log('account not connected')
    let getStatus = localStorage.getItem(`${account?account:account_address}-${tokenId}`)
    if(getStatus =='minted') return console.log(tokenId,' is already minted')
        const tokens = await axios.get(`${baseUrl}/nft/g2w3-1155/get-tokens/${account?account:account_address}/${contract}/${tokenId}`);
        console.log(tokens)
        // console.log(tokens?.data?.number_of_tokens?.tokens)
        if(tokens?.data?.number_of_tokens?.tokens !== undefined && tokens?.data?.number_of_tokens?.tokens>0) return console.log('already unlocked', tokenId)

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
        localStorage.setItem(`${account?account:account_address}-${tokenId}`,'minted')
   }



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

    const [imageUrl, setImageUrl] = useState(selectedAsset);
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
                img.src = selectedAsset;
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key == 'ArrowUp' || e.key == ' ') {
                img.src = selectedAsset;
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
            if(!account && !account_address) return navigate('/', { replace: true });
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
                        message.innerHTML = 'Game Over' + '<br>Press Enter To Restart'+'<br>Restart';
                        message.classList.add('messageStyle');
                        // img.style.display = 'none';
                        img.src = imageUrl;
                        bird_dy = -7.6;
                        handleMint();
                        // sound_die.play();
                        return;
                    } else {
                        if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1') {
                            score_val.innerHTML = + score_val.innerHTML + 1;
                            // console.log(score_val.innerHTML)
                            localStorage.setItem(`${account?account:account_address}-score`, parseInt(score_val.innerHTML))
                            let highScore = localStorage.getItem(`${account?account:account_address}-highScore`);
                            setHighScore(highScore)
                            if(highScore && highScore>=parseInt(score_val.innerHTML)) {

                            } else {
                                localStorage.setItem(`${account?account:account_address}-highScore`, parseInt(score_val.innerHTML))
                            }
                            highScore = localStorage.getItem(`${account?account:account_address}-highScore`);
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
                // game_state = 'End';
                // // message.style.left = '28vw';
                // console.log("HIT BOTTOM");
                // // alert("GAME OVER");
                // message.classList.remove('messageStyle');
                // handleMint();
                // return;
                // navigate('/', { replace: true })

                game_state = 'End';
                message.innerHTML = 'Game Over' + '<br>Press Enter To Restart'+'<br>Restart';
                message.classList.add('messageStyle');
                img.src = imageUrl
                        ;
                bird_dy = -7.6;
                // img.style.display = 'none';
                handleMint();
                // sound_die.play();
                return;
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
            <img src={imageUrl} alt="bird-img" className="bird" id="bird-1" />
            <div className="message">
                Enter To Start Game <p>
                    <span>&uarr;</span> ArrowUp to Control</p>
            </div>
            <div className="score">
                <div className='highScore'>{`High Score: `}<span className='highScoreVal'>{high_score?high_score:0}</span></div>
                {/* <div className="score_title"></div>
                <div className="score_val"></div> */}
                <div><span className='score_title'></span><span className='score_val'></span></div>
            </div>
        </div>
    )
}

export default PlayGame