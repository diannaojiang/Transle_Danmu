import React from 'react'
import { Mentions, Form, Button,notification ,Radio } from 'antd';
import $ from 'jquery'


var user = 0
var color = '14893055'
const Input = (props) => {
  const [form] = Form.useForm();
  const openNotificationWithIcon = (type,message,description) => {
    notification[type]({
    message,
    description,
    duration: 5,
  });
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = (values) => {
    var value = values.value
    senddanmu(value,value.length)

  };
  const onChange = e => {
    
    color = e.target.value
    console.log(color);
  };
  const senddanmu=(message,length)=>{
    var room=props.room.num;
    var split =0;
    var value,others
    value=others=message
    if(length>18){
      value = value.substring(0,18);
      console.log(value)
      others = others.substring(18)
      $('#danmu').val(others); 
      split =1
      length-=18
    }
    else{
      onReset();
    }
    $.ajax({
      type: "post",
      url: "https://danmu.sea-group.org/danmu.php",
      data: {room:room,user:user,danmu:value,loc_user:props.user,color:color},//提交到demo.php的数据
      dataType: "json",//回调函数接收数据的数据格式
      success: (msg)=>{
        var data='';
        if(msg!==''){
          data = eval("("+msg+")");    //将返回的json数据进行解析，并赋给data
        }
        if(data.hasOwnProperty("error")){
          openNotificationWithIcon("error",'发送失败',`error:${data.error},user:${data.user},msg:${data.danmu}`);
        }
        else{
          openNotificationWithIcon("success",'发送成功',`弹幕:${data.user}:${data.danmu}`);
        }
        console.log(data);    //控制台输出
      },
      error:(msg)=>{
        openNotificationWithIcon("error","连接失败","请检查网络连接或联系本人");
        console.log(msg);
      }
    });
    user++;
    if (split) {
      const values={value:others}
      setTimeout(function(){onFinish(values)}, 800);
    }
  }

function onkeydown(){
 if(window.event.keyCode === 13){
  window.event.preventDefault()
  var danmu=$('#danmu').val();
  if(danmu!==''){
    const values={value:danmu}
    onFinish(values)
  }
  }
}
  return (
    <div>
      <Radio.Group onChange={onChange}>
        <Radio.Button value="16777215" style={{color:'#000000'}}>白色</Radio.Button>
        <Radio.Button value="14893055" style={{color:'#e33fff'}}>紫色</Radio.Button>
        <Radio.Button value="5566168" style={{color:'#54eed8'}}>松石绿</Radio.Button>
        <Radio.Button value="5816798" style={{color:'#58c1de'}}>雨后蓝</Radio.Button>
        <Radio.Button value="4546550" style={{color:'#455ff6'}}>星空蓝</Radio.Button>
        <Radio.Button defaultChecked value="9920249" style={{color:'#975ef9'}}>紫罗兰</Radio.Button>
        <Radio.Button value="12802438" style={{color:'#c35986'}}>梦境红</Radio.Button>
        <Radio.Button value="16747553" style={{color:'#ff8c21'}}>热力橙</Radio.Button>
        <Radio.Button value="16774434" style={{color:'#fff522'}}>香槟金</Radio.Button>
        <Radio.Button value="16738408" style={{color:'#ff6868'}}>红色</Radio.Button>
        <Radio.Button value="6737151" style={{color:'#66ccff'}}>蓝色</Radio.Button>
        <Radio.Button value="65532" style={{color:'#00fffc'}}>青色</Radio.Button>
        <Radio.Button value="16766720" style={{color:'#ffd700'}}>盛典金</Radio.Button>
        <Radio.Button value="4286945" style={{color:'#4169e1'}}>升腾蓝</Radio.Button>
        <Radio.Button value="16474408" style={{color:'#fb6128'}}>南瓜色</Radio.Button>
        <Radio.Button value="8322816" style={{color:'#7eff00'}}>绿色</Radio.Button>
        <Radio.Button value="16772431" style={{color:'#ffed4f'}}>黄色</Radio.Button>
        <Radio.Button value="16750592" style={{color:'#ff9800'}}>橙色</Radio.Button>
        <Radio.Button value="16741274" style={{color:'#ff739a'}}>粉色</Radio.Button>

      </Radio.Group>
    <Form form={form} layout="horizontal" onFinish={onFinish} onKeyDown={()=>onkeydown()}>
      <Form.Item
        name="value"
        labelCol={{ span: 6 }}
        rules={[{ required: true }]}
      >
          <Mentions rows="3" id='danmu' autoFocus>
        </Mentions>
      </Form.Item>
      <Form.Item >
        <Button htmlType="submit" type="primary">
          Submit
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button htmlType="button" onClick={onReset} >
          Reset
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};
export default Input