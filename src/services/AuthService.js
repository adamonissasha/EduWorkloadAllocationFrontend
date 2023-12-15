import api from "../http";
import api_with_header from "../http/WithHeader";

export default class AuthService {
    auth(userData) {
        return (
            api.post('user', userData)
        );
    }

    changePassword(userData) {
        return (
            api_with_header.put("user/change/password", userData)
        );
    }
}