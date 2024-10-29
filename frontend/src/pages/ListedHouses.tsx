import { useEffect, useState } from "react";
import { BMRContract, ERCContract, web3 } from "../utils/contracts";
import { Button, Card, message, Image, Empty } from "antd";
import roomImage from "../assets/room.jpg";

interface House {
  tokenId: number;
  price: number;
  owner: string;
  listedTimestamp: number;
  isListed: boolean;
}

//@ts-ignore
const ListedHouses = ({ account, setPoint }) => {

  const [listedHouses, setListedHouses] = useState<House[]>([]); // 已挂牌房屋列表

  const getMyPoints = async () => {
    try {
      const result: number = await ERCContract.methods.getMyPoints().call({ from: account })
      setPoint(result.toString())
      console.log(result.toString())
    } catch (error: any) {
      message.error('获取积分失败，请检查网络连接或联系管理员')
    }
  }

  const getHousesListed = async () => {
    const result: House[] = await BMRContract.methods.getHousesListed().call({ from: account });
    console.log(result);
    setListedHouses(result);
  }
  useEffect(() => {
    getHousesListed();
  }, [account]);

  const buyHouse = async (tokenId: number, price: number) => {
    try {
      await BMRContract.methods.buyHouse(tokenId).send({ from: account, value: web3.utils.toWei(price.toString(), 'ether') });
      await getHousesListed();
      message.success('购买成功！');
    } catch (error: any) {
      message.error(error.message);
    }
  }
  
  const buyHouseWithPoint = async (tokenId: number, price: number) => {
    try {
      await ERCContract.methods.approve(BMRContract.options.address, price).send({ from: account });
      await BMRContract.methods.buyHouseWithPoint(tokenId).send({ from: account });
      await getHousesListed();
      await getMyPoints();
      message.success('购买成功！');
    } catch (error: any) {
      message.error(error.message);
    }
  }

  return (
    <>
      <h1>Listed Houses</h1>
      {
        (listedHouses.length === 0) && <Empty description="暂无上架房屋" />
      }
      {
        listedHouses.map((item) => (
          <Card title={`tokenId: ${item.tokenId}`} style={{ display: 'inline-block', width: 500, margin: 10 }} key={item.tokenId}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
              <Image
                width={150}
                src={roomImage}
              />
              <div style={{ flexGrow: 1 }}>
                <p>房所有者: {item.owner}</p>
                <p>上架时间: {new Date(Number(item.listedTimestamp) * 1000).toLocaleString()}</p>
                <p>上架价格: {item.price.toString()} 积分</p>
                <Button type="primary" onClick={() => buyHouseWithPoint(item.tokenId, item.price)}>买入</Button>
              </div>
            </div>
          </Card>
        ))
      }
    </>
  )
};

export default ListedHouses;