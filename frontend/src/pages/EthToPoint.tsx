import { Button, Card, Form, Input, message } from "antd";
import { useState } from "react";
import { web3, BMRContract, ERCContract } from '../utils/contracts';

// @ts-ignore
const EthToPoint = ({ account, setPoint }) => {

  const [inputPoint1, setInputPoint1] = useState<number>(0);
  const [inputPoint2, setInputPoint2] = useState<number>(0);

  const [curKey, setCurKey] = useState<string>('tab1');

  const getMyPoints = async () => {
    try {
      const result: number = await ERCContract.methods.getMyPoints().call({ from: account })
      setPoint(result.toString())
      console.log(result.toString())
    } catch (error: any) {
      message.error('获取积分失败，请检查网络连接或联系管理员')
    }
  }

  const buyPoints = async () => {
    try {
      await ERCContract.methods.EthToPoints().send({ from: account, value: web3.utils.toWei(inputPoint1.toString(), 'ether') });
      await getMyPoints();
      message.success('兑换成功');
    } catch (error) {
      message.error('兑换失败，请检查或稍后再试');
    }
  }
  const sellPoints = async () => {
    try {
      await ERCContract.methods.PointsToEth(inputPoint2).send({ from: account });
      await getMyPoints();
      message.success('出售成功');
    } catch (error) {
      message.error('出售失败，请检查或稍后再试');
    }
  }

  return (
    <>
      <h1>1 ETH = 1 POINT</h1>
      <Card
        style={{ width: '50%', margin: 'auto' }}
        tabList={[
          { key: 'tab1', tab: '兑换积分' },
          { key: 'tab2', tab: '出售积分' },
        ]}
        activeTabKey={curKey}
        onTabChange={(key) => setCurKey(key)}
      >
        {curKey === 'tab1' ? (
          <Form labelCol={{
            span: 7,
          }}>
            <Form.Item label="要兑换的积分数量">
              <Input value={inputPoint1} onChange={(e) => setInputPoint1(Number(e.target.value))} />
            </Form.Item>
            <Form.Item label="所需要 eth 的数量">
              <Input value={inputPoint1} disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ float: 'right' }} onClick={buyPoints}>兑换</Button>
            </Form.Item>
          </Form>
        ) : (
          <Form labelCol={{
            span: 7,
          }}>
            <Form.Item label="要卖出的积分数量">
              <Input value={inputPoint2} onChange={(e) => setInputPoint2(Number(e.target.value))} />
            </Form.Item>
            <Form.Item label="能得到 eth 的数量">
              <Input value={inputPoint2} disabled />
            </Form.Item>
            <Form.Item>
              <Button type="primary" style={{ float: 'right' }} onClick={sellPoints}>卖出</Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </>
  );
}

export default EthToPoint;