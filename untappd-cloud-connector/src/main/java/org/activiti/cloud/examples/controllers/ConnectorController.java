package org.activiti.cloud.examples.controllers;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.activiti.cloud.examples.connectors.UntappdConnector;
import org.activiti.cloud.examples.services.UntappdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ConnectorController {

    @Autowired
    private UntappdService untappdService;

    @RequestMapping(method = RequestMethod.GET, path = "/v1/search")
    public ObjectNode search(@RequestParam("q") String query) {
        return untappdService.search(query);
    }

}
