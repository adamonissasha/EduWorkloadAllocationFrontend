import api from "../http";
import api_with_header from "../http/WithHeader";

export default class AuthService {
    auth(userData) {
        return (
            api.post('auth/', userData)
        );
    }

    changePassword(userData) {
        return (
            api_with_header.put("auth/change-password", userData)
        );
    }
}