package com.warrantyhub.security.oauth2;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Component
public class HttpCookieOAuth2AuthorizationRequestRepository
        implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {

    public static final String OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME =
            "oauth2_auth_request";

    public static final String REDIRECT_URI_PARAM_COOKIE_NAME =
            "redirect_uri";

    private static final int COOKIE_EXPIRE_SECONDS = 180;

    private final ObjectMapper objectMapper;

    public HttpCookieOAuth2AuthorizationRequestRepository(
            ObjectMapper objectMapper
    ) {
        this.objectMapper = objectMapper;
    }

    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(
            HttpServletRequest request
    ) {
        return getCookie(request, OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME)
                .map(this::deserialize)
                .orElse(null);
    }

    @Override
    public void saveAuthorizationRequest(
            OAuth2AuthorizationRequest authorizationRequest,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        if (authorizationRequest == null) {
            removeAuthorizationRequestCookies(request, response);
            return;
        }

        addCookie(
                request,
                response,
                OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME,
                serialize(authorizationRequest),
                COOKIE_EXPIRE_SECONDS
        );

        String redirectUriAfterLogin = request.getParameter("redirect_uri");

        if (StringUtils.hasText(redirectUriAfterLogin)) {
            addCookie(
                    request,
                    response,
                    REDIRECT_URI_PARAM_COOKIE_NAME,
                    redirectUriAfterLogin,
                    COOKIE_EXPIRE_SECONDS
            );
        }
    }

    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        OAuth2AuthorizationRequest authorizationRequest =
                loadAuthorizationRequest(request);

        removeAuthorizationRequestCookies(request, response);

        return authorizationRequest;
    }

    public void removeAuthorizationRequestCookies(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        deleteCookie(
                request,
                response,
                OAUTH2_AUTHORIZATION_REQUEST_COOKIE_NAME
        );

        deleteCookie(
                request,
                response,
                REDIRECT_URI_PARAM_COOKIE_NAME
        );
    }

    private Optional<Cookie> getCookie(
            HttpServletRequest request,
            String name
    ) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (name.equals(cookie.getName())) {
                    return Optional.of(cookie);
                }
            }
        }

        return Optional.empty();
    }

    private void addCookie(
            HttpServletRequest request,
            HttpServletResponse response,
            String name,
            String value,
            int maxAge
    ) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        /*
         * Local HTTP: false, so the browser sends the cookie.
         * Production HTTPS: true, when the request is detected as secure.
         */
        cookie.setSecure(request.isSecure());

        cookie.setMaxAge(maxAge);
        response.addCookie(cookie);
    }

    private void deleteCookie(
            HttpServletRequest request,
            HttpServletResponse response,
            String name
    ) {
        Cookie expiredCookie = new Cookie(name, "");
        expiredCookie.setPath("/");
        expiredCookie.setHttpOnly(true);
        expiredCookie.setSecure(request.isSecure());
        expiredCookie.setMaxAge(0);

        response.addCookie(expiredCookie);
    }

    private String serialize(
            OAuth2AuthorizationRequest authorizationRequest
    ) {
        try {
            ObjectNode root = objectMapper.createObjectNode();

            root.put(
                    "authorizationUri",
                    authorizationRequest.getAuthorizationUri()
            );

            root.put(
                    "clientId",
                    authorizationRequest.getClientId()
            );

            root.put(
                    "redirectUri",
                    authorizationRequest.getRedirectUri()
            );

            root.put(
                    "state",
                    authorizationRequest.getState()
            );

            root.put(
                    "authorizationRequestUri",
                    authorizationRequest.getAuthorizationRequestUri()
            );

            ArrayNode scopes = root.putArray("scopes");

            if (authorizationRequest.getScopes() != null) {
                authorizationRequest.getScopes().forEach(scopes::add);
            }

            root.set(
                    "additionalParameters",
                    objectMapper.valueToTree(
                            authorizationRequest.getAdditionalParameters()
                    )
            );

            root.set(
                    "attributes",
                    objectMapper.valueToTree(
                            authorizationRequest.getAttributes()
                    )
            );

            byte[] jsonBytes = objectMapper.writeValueAsBytes(root);

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(jsonBytes);

        } catch (JsonProcessingException ex) {
            throw new IllegalStateException(
                    "Could not serialize OAuth2 authorization request",
                    ex
            );
        }
    }

    private OAuth2AuthorizationRequest deserialize(Cookie cookie) {
        try {
            byte[] jsonBytes = Base64.getUrlDecoder()
                    .decode(cookie.getValue());

            JsonNode root = objectMapper.readTree(
                    new String(jsonBytes, StandardCharsets.UTF_8)
            );

            OAuth2AuthorizationRequest.Builder builder =
                    OAuth2AuthorizationRequest.authorizationCode();

            builder.authorizationUri(
                    getNullableText(root, "authorizationUri")
            );

            builder.clientId(
                    getNullableText(root, "clientId")
            );

            builder.redirectUri(
                    getNullableText(root, "redirectUri")
            );

            builder.state(
                    getNullableText(root, "state")
            );

            builder.authorizationRequestUri(
                    getNullableText(root, "authorizationRequestUri")
            );

            /*
             * Spring Security requires Set<String>, not List<String>.
             */
            Set<String> scopes = new LinkedHashSet<>();

            JsonNode scopesNode = root.get("scopes");

            if (scopesNode != null && scopesNode.isArray()) {
                for (JsonNode scope : scopesNode) {
                    if (scope.isTextual()) {
                        scopes.add(scope.asText());
                    }
                }
            }

            builder.scopes(scopes);

            builder.additionalParameters(
                    readObjectMap(root.get("additionalParameters"))
            );

            builder.attributes(
                    readObjectMap(root.get("attributes"))
            );

            return builder.build();

        } catch (Exception ex) {
            throw new IllegalStateException(
                    "Could not deserialize OAuth2 authorization request cookie",
                    ex
            );
        }
    }

    private String getNullableText(
            JsonNode root,
            String fieldName
    ) {
        JsonNode node = root.get(fieldName);

        if (node == null || node.isNull()) {
            return null;
        }

        return node.asText();
    }

    private Map<String, Object> readObjectMap(JsonNode node) {
        Map<String, Object> result = new LinkedHashMap<>();

        if (node == null || !node.isObject()) {
            return result;
        }

        Iterator<Map.Entry<String, JsonNode>> fields =
                node.fields();

        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> field = fields.next();

            result.put(
                    field.getKey(),
                    objectMapper.convertValue(
                            field.getValue(),
                            Object.class
                    )
            );
        }

        return result;
    }
}
