package com.warrantyhub.security.oauth2;

import com.warrantyhub.exception.OAuth2AuthenticationProcessingException;
import com.warrantyhub.model.enums.Provider;
import com.warrantyhub.model.User;
import com.warrantyhub.security.UserPrincipal;
import com.warrantyhub.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserService userService;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();

        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfo.of(registrationId, oAuth2User.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        String email = oAuth2UserInfo.getEmail();
        String name = oAuth2UserInfo.getName();
        String providerId = oAuth2UserInfo.getId();

        User user;
        try {
            user = userService.findOrCreateOAuth2User(
                    email,
                    name,
                    Provider.valueOf(registrationId.toUpperCase()),
                    providerId
            );
        } catch (Exception e) {
            throw new OAuth2AuthenticationProcessingException("Error processing OAuth2 user", e);
        }
        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }
}