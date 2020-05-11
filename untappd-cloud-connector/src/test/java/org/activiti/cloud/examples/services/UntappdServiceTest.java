package org.activiti.cloud.examples.services;

import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)
@TestPropertySource("classpath:application-test.properties")
public class UntappdServiceTest {

	@Autowired
	private UntappdService untappdService;

	@Test
	public void testSearch() {
		ObjectNode searchResult = untappdService.search("Punk IPA");

		System.out.println(searchResult);
	}

}
