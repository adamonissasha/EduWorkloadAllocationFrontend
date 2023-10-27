import api from "../http";

export default class AuthService {
    auth(userData) {
        return (
            api.post('auth/', userData)
        );
    }
}