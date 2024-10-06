package org.example.service;

import org.example.model.UserDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
import org.springframework.ldap.filter.AndFilter;
import org.springframework.ldap.filter.EqualsFilter;
import org.springframework.stereotype.Service;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import java.util.List;

@Service
public class LdapService {

    @Autowired
    private LdapTemplate ldapTemplate;
    @Autowired
    private LdapContextSource ldapContextSource;

    public UserDetail getUserByEmployeeNumber(String employeeNumber) {
        AndFilter filter = new AndFilter();
        filter.and(new EqualsFilter("objectclass", "person"));
        filter.and(new EqualsFilter("employeeNumber", employeeNumber));
        System.out.println(filter.encode());
        List<UserDetail> userDetailList = ldapTemplate.search(
                "ou=people",
                filter.encode(),
                (AttributesMapper<UserDetail>) attrs -> new UserDetail(
                        (String) attrs.get("employeeType").get(),
                        (String) attrs.get("employeeNumber").get(),
                        (String) attrs.get("displayName").get(),
                        null,
                        List.of(),
                        (String) attrs.get("mail").get()
                )
        );
        if (userDetailList.isEmpty()) {
            return null;
        }
        return userDetailList.get(0);
    }
}