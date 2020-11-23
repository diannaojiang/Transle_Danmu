import React,{Component} from 'react'
import WasmPlayer from '@easydarwin/easywasmplayer'
import './easy-player.css'

export default class EasyPlayer extends Component {
    state={
        player: '',
        //url: 'https://d1--cn-gotcha05.bilivideo.com/live-bvc/538037/live_692283831_36987605_1500.flv?cdn=cn-gotcha05&expires=1606130158&len=0&oi=1737340540&pt=web&qn=150&trid=f3d8ed7ff74a4d868f4e35e125d43d9a&sigparams=cdn,expires,len,oi,pt,qn,trid&sign=217b8456ac2265cf98b65ce21809841b&ptype=0&src=9&sl=6&order=1'
    }
    callbackfun = function (e) { 
        console.log(e);
    }
    componentDidMount(){
        var url = this.props.url
        
        var player = new WasmPlayer(null, 'Player', this.callbackfun,{
            openAudio:true,
            Height:true
        })
        this.setState({player})
        player.play(url, 1)
    }
    componentWillReceiveProps(nextProps){
        //console.log(nextProps.url)
        this.state.player.destroy()
        var player = new WasmPlayer(null, 'Player', this.callbackfun,{
            openAudio:true,
            Height:true
        })
        this.setState({player})
        player.play(nextProps.url, 1)
        //this.state.player.play(nextProps.url, 1)
    }
    componentWillUnmount(){
        if(this.state.player!==''){
            this.state.player.destroy()
        }
    }
    render(){
        //console.log(url)
        return(
            <div className="box">
            <div id="Player"></div>
            </div>
        )
        
    }

}