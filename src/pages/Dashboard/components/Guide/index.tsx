/*
 * @Description: 主页面
 * @Author: Pony
 * @Date: 2021-08-21 22:20:26
 * @LastEditors: Pony
 * @LastEditTime: 2021-08-22 01:35:56
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
          // 除了当前项的开始时间
          if (rowIndex == index) {
            i['endTime'] === date && (isRepeat = true);
          }
          if (rowIndex != index) {
            i['startTime'] === date && (isRepeat = true);
            i['endTime'] === date && (isRepeat = true);
          }  
        })
        if (isRepeat) {
          return Promise.reject(new Error('开始时间存在重复!'));
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
          // 除了当前项的开始时间
          if (rowIndex == index) {
            i['startTime'] === date && (isRepeat = true);
          }
          if (rowIndex != index) {
            i['startTime'] === date && (isRepeat = true);
            i['endTime'] === date && (isRepeat = true);
          }
        })
        if (isRepeat) {
          return Promise.reject(new Error('结束时间存在重复!'));
        } 
  
        return Promise.resolve();
      }
    }
  }
  const checkAllData = (date, str, index) => {
    
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
                      requiredTrigger="onBlur"
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
                       requiredTrigger="onBlur"
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
