import React,{useState} from 'react'
import { Input, Form, Button,notification ,Radio } from 'antd';
import $ from 'jquery'

const { TextArea } = Input;
var user = 0
const colorlist = [
  {value:"16777215",color:'#000000',inner:'白色'},
  {value:"14893055",color:'#e33fff',inner:'紫色'},
  {value:"5566168",color:'#54eed8',inner:'松石绿'},
  {value:"5816798",color:'#58c1de',inner:'雨后蓝'},
  {value:"4546550",color:'#455ff6',inner:'星空蓝'},
  {value:"9920249",color:'#975ef9',inner:'紫罗兰'},
  {value:"12802438",color:'#c35986',inner:'梦境红'},
  {value:"16747553",color:'#ff8c21',inner:'热力橙'},
  {value:"16774434",color:'#fff522',inner:'香槟金'},
  {value:"16738408",color:'#ff6868',inner:'红色'},
  {value:"6737151",color:'#66ccff',inner:'蓝色'},
  {value:"65532",color:'#00fffc',inner:'青色'},
  {value:"16766720",color:'#ffd700',inner:'盛典金'},
  {value:"4286945",color:'#4169e1',inner:'升腾蓝'},
  {value:"16474408",color:'#fb6128',inner:'南瓜色'},
  {value:"8322816",color:'#7eff00',inner:'绿色'},
  {value:"16772431",color:'#ffed4f',inner:'黄色'},
  {value:"16750592",color:'#ff9800',inner:'橙色'},
  {value:"16741274",color:'#ff739a',inner:'粉色'},

]
const InputMsg = (props) => {
  const [color,setColor] = useState({value:"14893055",color:'#e33fff',inner:'紫色'});

  const [form] = Form.useForm();
  const openNotificationWithIcon = (type,message,description) => {
    notification[type]({
    message,
    description,
    duration: 3,
  });
  };
  const onReset = () => {
    form.resetFields();
  };
  const onFinish = (msg) => {
    var message = msg.value
    senddanmu(message,message.length)

  };
  const senddanmu=(message,length)=>{
    var room=props.room.num;
    var split =0;
    var headmsg,others
    headmsg=others=message
    if(length>18){
      headmsg = headmsg.substring(0,18);
      others = others.substring(18)
      form.setFieldsValue({
        value:others
      })
      //$('#danmu').val(others); 
      split =1
      length-=18
    }
    else{
      onReset();
    }
    //console.log(headmsg,color.value)
    
    $.ajax({
      type: "post",
      url: "https://danmu.sea-group.org/danmu.php",
      data: {room:room,user:user,danmu:headmsg,loc_user:props.user,color:color.value},//提交到demo.php的数据
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
      const msg={value:others}
      setTimeout(function(){onFinish(msg)}, 800);
    }
  }

function onkeydown(){
 if(window.event.keyCode === 13){
  window.event.preventDefault()
  const msg = form.getFieldsValue()
  if(msg.value!=='')
    onFinish(msg)
  }
  
}
  const radioButtons = colorlist.map((radioButton,index)=>
  <Radio.Button key={index} value={radioButton} style={{color:radioButton.color}}>{radioButton.inner}</Radio.Button>
  )
  return (
    <div>
      <div>当前选择颜色:{color.inner}</div>
      <Radio.Group onChange={(e) => setColor(e.target.value)}>
        {radioButtons}
      </Radio.Group>
    <Form form={form} layout="horizontal" onFinish={onFinish} onKeyDown={()=>onkeydown()}>
      <Form.Item
        name="value"
        labelCol={{ span: 6 }}
        rules={[{ required: true }]}
      >
      <TextArea rows={3}  autoFocus showCount />
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
export default InputMsg