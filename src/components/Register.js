import ReCAPTCHA from "react-google-recaptcha";
import React, { useState, useCallback } from 'react';
import {
    Layout,
    Page,
    Card,
    Link,
    Button,
    FormLayout,
    TextField,
    AccountConnection, Toast, InlineError
} from '@shopify/polaris';
import { saveItem } from "../api/baseApi"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function Register() {
    const [first, setFirst] = useState('');
    const [last, setLast] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const handleFirstChange = useCallback((value) => setFirst(value), []);
    const handleLastChange = useCallback((value) => setLast(value), []);
    const handleEmailChange = useCallback((value) => setEmail(value), []);
    const handlePasswordChange = useCallback((value) => setPassword(value), []);
    const handlePhoneChange = useCallback((value) => setPhone(value), []);
    const handleAddressChange = useCallback((value) => setAddress(value), []);

    let user = {
        firstname: first,
        password: password,
        address: address,
        phone: phone,
        lastname: last,
        email: email
    }


    //#region rule Input
    const textFieldID = 'ruleContent';
    const isEmailInvalid = isValueEmailInvalid(email);
    const isPasswordInvalid = isValuePasswordInvalid(password);
    const errorEmailMessage = isEmailInvalid ? 'Email không hợp lệ' : '';
    const errorPasswordMessage = isPasswordInvalid ? 'Password không hợp lệ' : '';
    function isValuePasswordInvalid(content) {
        return /[A-Z]/.test(content) && /[0-9]/.test(content) && !/[aeiou]/.test(content) && /^[@#][A-Za-z0-9]{7,13}$/.test(content);
    }
    function isValueEmailInvalid(content) {
        if (content == null || content == "") return false;
        var check = content && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(content) ?
            true : false;
        return check;
    }
    //#endregion
    //#region API
    const Register = (u) => {
        if (isEmailInvalid == isPasswordInvalid == false) {
            return toast.warning("Nhập nghiêm túc vào!");
        }
        if(u.last == "" || u.email == "" || u.password == ""){
            return toast.error("Không bỏ trống các ô có chứa hoa thị!");
        }
        else {
            try {
                saveItem(u)
                .then((res) => {
                    if (res.status == "200"){
                        window.location.href = '/UserList';
                    }
                    else return toast.error(res.userMsg);
                })
                .catch((res) => {
                    return toast.error(res.userMsg);
                });
            } catch (error) {
                return toast.error("Hệ thống đang có vấn đề! Vui lòng liên hệ Dương để được trợ giúp!");
            }
        }
    }
    //#endregion
    return (
        <Page>
            <ToastContainer />
            <Layout>
                <Card sectioned>
                    <FormLayout>
                        <FormLayout.Group>
                            <TextField
                                value={first}
                                type="text"
                                label="First name"
                                placeholder="Tom"
                                onChange={handleFirstChange}
                                autoComplete="given-name"
                                autoFocus

                            />
                            <TextField
                                value={last}
                                label="Last name *"
                                placeholder="Ford"
                                type="text"
                                onChange={handleLastChange}
                                autoComplete="family-name"
                            />

                        </FormLayout.Group>
                        <FormLayout.Group>
                            <TextField
                                value={phone}
                                type="tel"
                                label="Phone Number"
                                onChange={handlePhoneChange}
                                autoComplete="given-name"
                            />
                            <TextField
                                value={address}
                                label="Address"
                                placeholder="TP. Từ Sơn, Bắc Ninh"
                                onChange={handleAddressChange}
                                autoComplete="family-name"
                            />
                        </FormLayout.Group>
                        <TextField
                            value={email}
                            label="Email *"
                            placeholder="example@email.com"
                            onChange={handleEmailChange}
                            autoComplete="email"
                            error={isEmailInvalid}
                            id={textFieldID}
                            error={errorEmailMessage}
                        />
                        <TextField
                            type="password"
                            value={password}
                            label="Password *"
                            onChange={handlePasswordChange}
                            autoComplete="password"
                            error={isPasswordInvalid}
                            id={textFieldID}
                            error={errorPasswordMessage}
                        />
                        <ReCAPTCHA width="254px"
                            sitekey="6Lcpfj4dAAAAAEtWd_i_t2IzOG3lz0n-ZG9arpSf"
                            onChange={onChange}
                        />
                        <Button primary onClick={() => Register(user)}>Đăng ký</Button>
                    </FormLayout>

                </Card>
            </Layout>

        </Page>
    )
}


function onChange(value) {
    console.log("Captcha value:", value);
}

export default Register;
