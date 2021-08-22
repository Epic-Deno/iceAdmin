/*
 * @Description: 主页面
 * @Author: Pony
 * @Date: 2021-08-21 22:20:26
 * @LastEditors: Pony
 * @LastEditTime: 2021-08-22 12:13:56
 * @FilePath: /iceAdmin/src/pages/Dashboard/components/Guide/index.tsx
 */
import React, { useState } from 'react';
import { Button, TimePicker, Form, Grid } from '@alifd/next';
import moment from 'moment';
import styles from './index.module.scss';
// 1. 时间不能重复
// 2. 开始时间小于结束时间
const formItemLayout = {
  labelCol: {
    fixedSpan: 8
  },
  wrapperCol: {
    span: 14
  }
};
const FormItem = Form.Item;
const { Row, Col } = Grid;
const Guide = () => {
  const handleSubmit = (values, errors) => {
    console.log(values, errors)
  }
  const [baseTimeArr, addTimeStr] = useState([{
    startTime: '',
    endTime: '',
  }]);
  const addNewTimeStr = () => {
    addTimeStr([
      ...baseTimeArr,
      {
        startTime: '',
        endTime: ''
      }
    ])
  }
  const checkRange = (fieldObj, val) => {
    const { field, validator } = fieldObj;
   
    if (field) {
     let fieldArray = field.split('_');
     let date = val.format("HH:mm:ss");
     let str = fieldArray[0];
     let index = fieldArray[1];
     console.log(val.format("HH:mm:ss"), index)
      if (str == 'startTime') {
        // 第一步验证当前行的的开始时间小于结束时间
        let notPass = false;
        const { endTime } = baseTimeArr[index]
        if (endTime) {
          date >= endTime && (notPass = true)
        } 
       
        if (notPass) {
          return Promise.reject(new Error('开始时间不能大于结束时间!'));
        } 
        // 第二步遍历所有的时间数组的每一项是否存在 和这个值相同的时间
        let isRepeat = false;
       
        baseTimeArr.map((i, rowIndex) => {
          if (rowIndex != index) {
            console.log(date >= i['startTime'] , date < i['endTime'])
            // i['startTime'] === date && (isRepeat = true);
            // i['endTime'] === date && (isRepeat = true);
            date >= i['startTime'] && date < i['endTime'] && (isRepeat = true)
            // 当行的endTime 需要判断 这个startTime是否在是否大于等于end
            endTime && endTime > i['endTime'] && date < i['endTime'] && (isRepeat = true)
          }  
        })
        if (isRepeat) {
          return Promise.reject(new Error('时间段存在重复!'));
        } else {
          return Promise.resolve();
        }
      }
      if (str == 'endTime') {
        // 第一步验证当前行的的开始时间小于结束时间
        let notPass = false;
        const { startTime } = baseTimeArr[index]
        if (startTime) {
          console.log(date <= startTime)
          date <= startTime && (notPass = true)
        }
        if (notPass) {
          return Promise.reject(new Error('结束时间不能小于开始时间!'));
        } 
        let isRepeat = false; // 是否重复
        baseTimeArr.map((i, rowIndex) => {
          if (rowIndex != index) {
            date > i['startTime'] && date <= i['endTime'] && (isRepeat = true)
            // 当开始时间选完 小于一个时间段的开始时间 结束时间就必须要小于等于上一个开始时间
            startTime && startTime < i['startTime'] && date > i['startTime'] && (isRepeat = true)
          }
        })
        if (isRepeat) {
          return Promise.reject(new Error('时间段存在重复!'));
        } else {
          return Promise.resolve();
        }
        
      }
    }
  }
  return (
    <div className={styles.container}>
      <Form style={{ width: "60%" }} {...formItemLayout} colon>
        <FormItem>
          <Button type="primary" onClick={addNewTimeStr}>增加可选时段</Button>
        </FormItem>
        <FormItem
            label="可选入馆时间"
            required
            requiredMessage="Please input your password!"
          >
           {
              baseTimeArr.map((item, index) => (
                <Row gutter={12} key={index}>
                  <Col span="11">
                    <FormItem 
                      required 
                      label="" 
                      colon={false}
                     
                      validator={checkRange}
                      autoValidate={true}
                    >
                      <TimePicker 
                        name={`startTime_${index}`} 
                        style={{ width: '100%' }} 
                        onChange={val => item.startTime = val.format("HH:mm:ss") } 
                      />
                    </FormItem>
                  </Col>
                  <Col span="2" >
                    <div style={{ height: '100%', width: '100%', lineHeight: '32px' }}>至</div>
                  </Col>
                  <Col span="11">
                    <FormItem
                       required 
                       label="" 
                       colon={false} 
                      
                       validator={checkRange}
                       autoValidate={true}
                      >
                      <TimePicker 
                        name={`endTime_${index}`} 
                        style={{ width: '100%' }} 
                        onChange={val => item.endTime = val.format("HH:mm:ss") }
                      />
                    </FormItem>
                  </Col>
                </Row>
              ))
            }
          </FormItem>
          <FormItem label=" " colon={false}>
            <Form.Submit
              type="primary"
              validate
              onClick={handleSubmit}
              style={{ marginRight: 8 }}
            >
              提交
            </Form.Submit>
            <Form.Reset>重置</Form.Reset>
        </FormItem>
      </Form>
    </div>
  );
};

export default Guide;
