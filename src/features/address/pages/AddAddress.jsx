import {
    Col,
    Row,
    Card,
    Typography,
    Select,
    Space,
    Input,
    Form,
} from "antd"
import { PlusOutlined } from "@ant-design/icons"
import ButtonUI from "components/UIKit/ButtonUI"
import { useHistory } from "react-router-dom"
import { checkAuth } from "helper/auth"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux'
import {
    getProvinces,
    getDistricts,
    getWards,
    selectProvinces,
    selectDistricts,
    selectWards,
} from '../../location/locationSlice'
import { insertAddress, selectAddressMessage, setDefaultAddressMessage } from "../addressSlice"
import { ASYNC_STATUS } from "../../../constants"

const { Title } = Typography
const { Option } = Select

const AddAddress = () => {
    const goBack = () => {
        history.goBack()
    }
    const provinces = useSelector(selectProvinces)
    const districts = useSelector(selectDistricts)
    const address_message = useSelector(selectAddressMessage)
    const wards = useSelector(selectWards)
    const history = useHistory()
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const [disableLocation, setDisableLocation] = useState({
        disableDistricts: true,
        disableWards: true
    })

    useEffect(() => {
        const isUserLoggedIn = checkAuth()
        if (!isUserLoggedIn) {
            history.push("/")
        }
        else {
            dispatch(getProvinces())
        }
    }, [history, dispatch])

    useEffect(() => {
        if (address_message === ASYNC_STATUS.SUCCESS) {
            dispatch(setDefaultAddressMessage())
            history.push('/order')
        }
    }, [dispatch, address_message, history])

    const handleProvinces = (e) => {
        dispatch(getDistricts(getId(e)))
        setDisableLocation((preState) => {
            return {
                ...preState,
                disableDistricts: false,
                disableWards: true,
            }
        })
        form.setFieldsValue({
            districtId: null,
            wardId: null
        })
    }

    const handleDistricts = (e) => {
        dispatch(getWards(getId(e)))
        setDisableLocation((preState) => {
            return {
                ...preState,
                disableWards: false,
            }
        })
        form.setFieldsValue({
            wardId: null
        })
    }

    const getId = (string) => {
        return JSON.parse(string)[0]
    }
    const handleSubmit = (e) => {
        const address = {
            name: e.name,
            phone: e.phone,
            provinceId: getId(e.provinceId),
            districtId: getId(e.districtId),
            wardId: getId(e.wardId),
            address: e.address
        }
        dispatch(insertAddress(address))
    }

    return (
        <Row type="flex" align="middle" justify="center" className="my-5">
            <Col lg={14} xs={23}>
                <Card className="card-shadow border px-2">
                    <Row>
                        <Col xs={24} md={22}>
                            <Title level={4} style={{ color: "#e99667" }}>
                                <Space>
                                    <PlusOutlined />
                                    Th??m ?????a ch???
                                </Space>
                            </Title>
                        </Col>
                    </Row>
                    <Form
                        className="mt-5"
                        layout="vertical"
                        form={form}
                        onFinish={handleSubmit}
                    >
                        {/* User information */}
                        <Row gutter={20} type="flex">
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label="H??? t??n ng?????i nh???n"
                                    name="name"
                                    rules={[
                                        { required: true, message: "B???n ph???i nh???p th??ng tin n??y!" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label="S??? ??i???n tho???i"
                                    name="phone"
                                    rules={[
                                        { required: true, message: "B???n ph???i nh???p th??ng tin n??y!" },
                                        {
                                            pattern: new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i),
                                            message: "Vui nh???p s??? ??i???n tho???i h???p l??? !"
                                        },
                                        {
                                            max: 18,
                                            message: 'Vui nh???p s??? ??i???n tho???i h???p l??? !',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                        {/* Address information */}
                        <Row gutter={20}>
                            { }
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label="T???nh/th??nh ph???"
                                    name="provinceId"
                                    rules={[
                                        { required: true, message: "B???n ph???i nh???p th??ng tin n??y!" },
                                    ]}
                                >
                                    <Select showSearch
                                        onSelect={handleProvinces}
                                        placeholder="Ch???n t???nh"
                                    >
                                        {provinces.length > 0 && provinces.map((prov) => (
                                            <Option
                                                key={prov.id}
                                                value={JSON.stringify([prov.id, prov.name])}
                                            >
                                                {prov.name}
                                            </Option>
                                        ))}
                                    </Select>

                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label="Qu???n/ huy???n"
                                    name="districtId"
                                    rules={[
                                        { required: true, message: "B???n ph???i nh???p th??ng tin n??y!" },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        placeholder="Ch???n t???nh"
                                        disabled={disableLocation.disableDistricts}
                                        onSelect={handleDistricts}
                                    >
                                        {districts.map((prov) => (
                                            <Option
                                                key={prov.id}
                                                value={JSON.stringify([prov.id, prov.name])}
                                            >
                                                {prov.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item
                                    label="Ph?????ng/ x??"
                                    name="wardId"
                                    rules={[
                                        { required: true, message: "B???n ph???i nh???p th??ng tin n??y!" },
                                    ]}
                                >

                                    <Select
                                        showSearch
                                        placeholder="Ch???n ph?????ng x??"
                                        disabled={disableLocation.disableWards}
                                    >
                                        {wards.map((prov) => (
                                            <Option
                                                key={prov.id}
                                                value={JSON.stringify([prov.id, prov.name])}
                                            >
                                                {prov.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} lg={24}>
                                <Form.Item
                                    label="?????a ch???"
                                    name="address"
                                    rules={[
                                        { required: true, message: "B???n ph???i nh???p th??ng tin n??y!" },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Col style={{ textAlign: "center", marginTop: "2em" }}>
                            <Space className="mt-4" size={20}>
                                <ButtonUI htmlType="button" text="Quay l???i" variant="secondary" onClick={goBack}></ButtonUI>
                                <ButtonUI
                                    htmlType="submit"
                                    text="X??c nh???n"
                                ></ButtonUI>
                            </Space>
                        </Col>
                    </Form>
                </Card>
            </Col>
        </Row>
    )
}

export default AddAddress