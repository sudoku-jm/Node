const {isLoggedIn, isNotLoggedIn} = require('../middlewares');

describe('isLoggedIn', () => {
    //공통 사용
    const res = {
        status : jest.fn(() => res),
        send : jest.fn(),
    };
    const next = jest.fn();
    test('로그인 되어 있으면 isLoggedIn이 next호출 해야 함', () => {
        const req = {
            isAuthenticated : jest.fn(() => true),
        }
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
    test('로그인 되어 있지않으면 isLoggedIn이 에러를 응답 해야 함', () => {
        const req = {
            isAuthenticated : jest.fn(() => false),
        }
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
})
describe('isNotLoggedIn', () => {
    //공통 사용
    const res = {
        redirect : jest.fn(),
    };
    const next = jest.fn();
    test('로그인 되어 있으면 isNotLoggedIn이 에러를 응답 해야 함', () => {
        const req = {
            isAuthenticated : jest.fn(() => true),
        
        }
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });
    test('로그인 되어 있지않으면 isNotLoggedIn이 next를 호출 해야 함', () => {
        const req = {
            isAuthenticated : jest.fn(() => false),
        }
        isNotLoggedIn(req, res, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
})