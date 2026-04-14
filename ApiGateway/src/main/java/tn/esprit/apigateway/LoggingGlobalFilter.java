package tn.esprit.apigateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.net.URI;

import static org.springframework.cloud.gateway.support.ServerWebExchangeUtils.*;

@Component
public class LoggingGlobalFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(LoggingGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // Log avant le routage
        String path = exchange.getRequest().getPath().toString();
        String method = exchange.getRequest().getMethod().toString();
        
        logger.info("🌐 [API GATEWAY] Requête entrante : {} {}", method, path);
        
        // Récupérer la route
        Route route = exchange.getAttribute(GATEWAY_ROUTE_ATTR);
        if (route != null) {
            logger.info("📍 [API GATEWAY] Route ID : {}", route.getId());
            logger.info("🎯 [API GATEWAY] URI cible : {}", route.getUri());
        }
        
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            // Log après le routage
            URI targetUri = exchange.getAttribute(GATEWAY_REQUEST_URL_ATTR);
            if (targetUri != null) {
                logger.info("✅ [API GATEWAY] Requête routée vers : {}", targetUri);
                logger.info("🏷️  [API GATEWAY] Instance : {}:{}", targetUri.getHost(), targetUri.getPort());
            }
            
            int statusCode = exchange.getResponse().getStatusCode() != null 
                ? exchange.getResponse().getStatusCode().value() 
                : 0;
            logger.info("📤 [API GATEWAY] Réponse : {} - Status {}", path, statusCode);
            logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        }));
    }

    @Override
    public int getOrder() {
        return -1; // Exécuter en premier
    }
}
