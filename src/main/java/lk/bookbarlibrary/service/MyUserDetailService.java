package lk.bookbarlibrary.service;

import jakarta.transaction.Transactional;
import lk.bookbarlibrary.user.dao.UserDao;
import lk.bookbarlibrary.user.entity.Role;
import lk.bookbarlibrary.user.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserDao userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // logged user object from database
        User loggedUser= userDao.getByUsername(username);

        // authorities are roles
        Set<GrantedAuthority> authorities = new HashSet<>();
        for(Role role:loggedUser.getRoles()){
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(),loggedUser.getPassword(),
                loggedUser.getUserstatus(),true,true,true,authorities);
    }
}
