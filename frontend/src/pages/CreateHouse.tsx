import { useState } from "react";
import { BMRContract } from "../utils/contracts";
import { Button, message, Select } from "antd";

//@ts-ignore
const CreateHouse = ({account, accounts}) => {

  const [toAccount, setToAccount] = useState<string>(''); // 转账目标地址

  const createHouse = async () => {
    try {
      const result = await BMRContract.methods.createHouse(toAccount).send({ from: account });
      console.log(result);
      message.success('Create House Success');
    } catch (error: any) {
      message.error(error.message);
    }
  }

  return (
    <div>
      <h1>Create House</h1>
      <p>注意：合约部署者才可以创建房屋</p>
      <Select
        style={{ width: 400 }}
        value={toAccount}
        onChange={(value: string) => setToAccount(value) }
        options={accounts.map((item:any) => ({ value: item }))}
      ></Select>
      <Button type="primary" onClick={createHouse}>创建房屋</Button>
    </div>
  )
}

export default CreateHouse;