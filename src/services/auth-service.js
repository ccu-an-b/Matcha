import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

class AuthService {

    key = 'auth_token' ;

    getToken() {
        return localStorage.getItem(this.key);
    }

    decode(token){
        return jwt.decode(token);
    }

    saveToken(token) {
        return localStorage.setItem(this.key, token);
    }

    deleteToken(){
        return localStorage.removeItem(this.key);
    }

    getExpiration(token){
        const exp = this.decode(token).exp;

        return moment.unix(exp);
    }

    getUsername() {
        return this.decode(this.getToken()).username;
    }

    getUserId() {
        return this.decode(this.getToken()).userId;
    }

    isValid(token){
        return moment().isBefore(this.getExpiration(token));
    }

    isAuthentificated(){
        const token = this.getToken();

        return (token && this.isValid(token)) ? true: false ;
    }

}

export default new AuthService();