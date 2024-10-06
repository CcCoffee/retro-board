package org.example.service;

import org.example.model.UserDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.core.AttributesMapper;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;
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

    public List<UserDetail> getAllUsers() {
//        List<Object> mail = new LdapTemplate(ldapContextSource).search("uid=E001,ou=people", "(objectclass=person)", (AttributesMapper<Object>) attributes -> attributes.get("mail").get());
        return ldapTemplate.search(
            "ou=people",
            "(objectclass=person)",
                (AttributesMapper<UserDetail>) attrs -> new UserDetail(
                    (String) attrs.get("employeeType").get(),
                    (String) attrs.get("employeeNumber").get(),
                    (String) attrs.get("displayName").get(),
                    (String) attrs.get("givenName").get(),
                    (String) attrs.get("sn").get(),
                    (String) attrs.get("mail").get(),
                    null,  // 密码字段设为null，因为LDAP通常不会返回密码
                    null   // 角色字段设为null，如果需要可以后续处理
                )
        );
    }
}