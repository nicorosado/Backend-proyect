import { userService } from '../services/userService.js';
import { sendMail } from '../services/mailer.js'
import Swal from 'sweetalert2';
class UsersController {
    register(req, res) {
        return userService.register(res);
    };
    registerFail(req, res) {
        return userService.registerFail(res);
    };
    registerPassport(req, res) {
        if (!req.user) {
            return res.json({ error: 'user doesnt exists' });
        };
        return userService.dashboard(req, res);
    };
    login(req, res) {
        return res.render('login', {});
    }
    loginPassport(req, res) {
        if (!req.user) {
            return res.json({ error: 'Error in credentials' });
        };
        return userService.dashboard(req, res);
    };
    loginFail(req, res) {
        return userService.loginFail(res);
    }
    logOut(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).render('error', { error: 'couldnt close session' });
            };
            return res.redirect('/auth/login');
        });
    };
    dashboard(req, res) {
        const user = req.session.user;
        return res.render('dashboard', { user: user });
    };

    async changePremiumUser(req, res) {
        try {
            const userId = req.params.uid;
            const userData = await userService.getUserByIdOrEmail(userId, null);
            const userChanged = userData?.isPremium ? await userService.updateUser(userId, { isPremium: false })
                : await userService.updateUser(userId, { isPremium: true });
            return res.json(userChanged)
        } catch (err) {
            return res.status(500).json({ error: 'Error changing users' });
        }
    }

    async changeUserRole(req, res) {
        try {
            const userId = req.params.uid;
            const userData = await userService.getUserByIdOrEmail(userId, null);
            const newRole = userData?.role === 'user' ? 'admin' : 'user';
            const userChanged = await userService.updateUser(userId, { role: newRole });
            console.log(userChanged)
            return res.json(userChanged);
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: 'Error changing user role' });
        }
    }

    profile(req, res) {
        const user = req.session.user;
        return res.render('profile', { user: user });
    };

    async getUsers(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const users = await userService.getUsers(limit);
            res.render('users', { users });
        } catch (err) {
            return res.status(500).json({ error: 'Error obtaining users' });
        }
    }

    async getUserById(req, res) {
        const uid = req.params.uid;
        try {
            const user = await userService.getUserByIdOrEmail(uid, null);
            user ? user : (() => { throw (`User with id ${uid} doesnt exists in db`) })();
            return res.json(user)
        } catch (err) {
            return res.status(500).json({ Error: `didnt find user ${err}` });
        }
    };

    async deleteUser(req, res) {
        const uid = req.params.uid;
        try {
            const deletedUserId = await userService.deleteUser(uid);
            return res.json({ userId: deletedUserId });
        } catch (err) {
            return res.status(500).json({ Error: `Failed to delete user: ${err}` });
        }
    };

    async deleteInactiveUsers(req, res) {
        try {
            const now = new Date();
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(now.getDate() - 2);
            const usersToDelete = await userService.getUsers(0, { lastLoginDate: { $lt: twoDaysAgo } });

            let deletedUserCount = 0;

            for (const user of usersToDelete) {
                try {
                    sendMail(user.email);
                    await userService.deleteUser(user._id);
                    deletedUserCount++;
                } catch (err) {
                    console.error(`Error deleting user ${user._id}: ${err}`);
                }
            }

            return res.json(usersToDelete);
        } catch (err) {
            return res.status(500).json({ Error: `Could not delete users: ${err}` });
        }
    }
}

export const usersController = new UsersController();
