package org.activiti.cloud.examples.connectors;

import java.util.Map;

import org.activiti.cloud.api.process.model.IntegrationRequest;
import org.activiti.cloud.api.process.model.IntegrationResult;
import org.activiti.cloud.connectors.starter.channels.IntegrationResultSender;
import org.activiti.cloud.connectors.starter.configuration.ConnectorProperties;
import org.activiti.cloud.connectors.starter.model.IntegrationResultBuilder;
import org.activiti.cloud.examples.services.UntappdService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;

import static net.logstash.logback.marker.Markers.append;

@Component
@EnableBinding(UntappdConnectorChannels.class)
public class UntappdConnector {

    private final Logger logger = LoggerFactory.getLogger(UntappdConnector.class);

    private final static String SEARCH_TERM_PROPERTY_NAME = "untappd-query";
    private final static String SEARCH_RESULT_PROPERTY_NAME = "untappd-query-results";

    @Value("${spring.application.name}")
    private String appName;

    @Autowired
    private ConnectorProperties connectorProperties;

    @Autowired
    private UntappdService untappdService;

    private final IntegrationResultSender integrationResultSender;

    public UntappdConnector(IntegrationResultSender integrationResultSender) {
        this.integrationResultSender = integrationResultSender;
    }

    @StreamListener(UntappdConnectorChannels.UNTAPPD_CONNECTOR_SEARCH_CONSUMER)
    public void search(IntegrationRequest event) {

        logger.info(append("service-name", appName), ">>> In untappd-cloud-connector");

        logger.info(UntappdConnector.class.getSimpleName() + " was called for instance " + event.getIntegrationContext().getProcessInstanceId());

        logger.info("Received inbound variables: " + event.getIntegrationContext().getInBoundVariables());

        String query = (String) event.getIntegrationContext().getInBoundVariables().get(SEARCH_TERM_PROPERTY_NAME);

        logger.info("Performing search: " + query);

        Message<IntegrationResult> message = IntegrationResultBuilder.resultFor(event, connectorProperties)
                .withOutboundVariables(Map.of(
                        SEARCH_RESULT_PROPERTY_NAME, untappdService.search(query)
                ))
                .buildMessage();

        integrationResultSender.send(message);
    }
}
