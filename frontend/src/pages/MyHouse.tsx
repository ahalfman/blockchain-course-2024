import { Button, Input, message, Card, Modal, Form, Image, Empty } from 'antd';
import { BMRContract, web3 } from '../utils/contracts';
import { useEffect, useState } from 'react';
import roomImage from '../assets/room.jpg';

interface House {
  tokenId: number;
  price: number;
  owner: string;
  listedTimestamp: number;
  isListed: boolean;
}

//@ts-ignore
const MyHouses = ({ account }) => {

  const [myHouses, setMyHouses] = useState<House[]>([]); // 当前用户的房屋列表
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [curtokenId, setCurTokenId] = useState<number>(0);
  const [curPrice, setCurPrice] = useState<number>(0);

  const getMyHouses = async () => {
    try {
      const result: House[] = await BMRContract.methods.getMyHouses().call({ from: account });
      setMyHouses(result);
    } catch (error: any) { }
  }
  useEffect(() => {
    getMyHouses();
  }, [account])


  const showModal = (tokenId: number) => {
    setIsModalOpen(true);
    setCurTokenId(tokenId);
  };

  const listMyHouse = async () => {
    try {
      const result = await BMRContract.methods.listHouse(curtokenId, curPrice).send({ from: account });
      console.log(result);
      message.success('上架成功');
      getMyHouses();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleOk = async () => {
    listMyHouse();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const delistMyHouse = async (tokenId: number) => {
    try {
      await BMRContract.methods.delistHouse(tokenId).send({ from: account });
      message.success('下架成功');
      getMyHouses();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return (
    <>
      <h1>My Houses</h1>
      {
        (myHouses.length === 0) && <Empty description="暂无房屋" />
      }
      {
        myHouses.map((item) => (
          console.log(item),
          <Card title={`tokenId: ${item.tokenId}`} style={{ display: 'inline-block', width: 500, margin: 10, height: 250 }} key={item.tokenId}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <Image
                width={150}
                src={roomImage}
              />
              <div style={{ flexGrow: 1 }}>
                <p style={{ marginTop: '0px' }}>上架情况: {item.isListed ? '已上架' : '未上架'}</p>
                {
                  item.isListed && (
                    <>
                      <p>上架时间: {new Date(Number(item.listedTimestamp) * 1000).toLocaleString()}</p>
                      <p>上架价格: {item.price.toString()} ETH</p>
                    </>
                  )
                }
                {item.isListed ? (
                  <Button type="primary" onClick={() => delistMyHouse(item.tokenId)}>下架</Button>
                ) : (
                  <Button type="primary" onClick={() => showModal(item.tokenId)}>上架</Button>
                )}
              </div>
            </div>
          </Card>
        ))
      }

      <Modal
        title="上架房屋"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form labelCol={{
          span: 3,
        }}>
          <Form.Item label="tokenId">
            <Input value={curtokenId} disabled />
          </Form.Item>
          <Form.Item label="price">
            <Input value={curPrice} onChange={(e) => setCurPrice(Number(e.target.value))} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default MyHouses;