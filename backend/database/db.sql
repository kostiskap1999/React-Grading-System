INSERT INTO `credentials` VALUES (1,'admin','123'),(2,'professor','456'),(3,'student','789'),(4,'student2','000');
INSERT INTO `users` VALUES (1,'admin', 'Admin','Admin', 0, 1),(2, 'professor', 'The','Professor', 1, 2),(3, 'student', 'Student','No1', 2, 3),(4, 'student2', 'Student','No2', 2, 4);
INSERT INTO `subjects` VALUES (1,'JavaScript Basics','The best programming language',5,2),(2,'JavaScript for Experts','The best programming language, but now with a little more pain and caffeine overdose.',7,2);
INSERT INTO `projects` VALUES (1,'Sum','From 1 to an input set by user, calculate the sum of multiplications of a constant addNum with the number of the current loop. Then, calculate if the result is more than 1000 and return this. The input should be given by the user as parameter of the main function. Make sure the main function is called main and the input is called input.','2023-10-31',1),(2,'JavaScript Project 2','How to alert \"Hello World\" on screen?','2023-10-31',1);
INSERT INTO `user_subject` VALUES (1,1,1),(2,1,2),(3,2,1),(4,2,2),(5,3,1),(6,4,2);
INSERT INTO `submissions` VALUES (1,'const addNum =  30\n\nfunction main(input){\n  var result = 0\n  for (let i=0; i<input; i++)\n    result += addNum*i\n\n  var finalResult = isMoreThanThousand(result)\n  return finalResult  \n}\n\nfunction isMoreThanThousand(mainResult){\n  if (mainResult > 1000)\n    return true\n  else\n    return false\n}','2023-11-28',NULL,'',1,1);
INSERT INTO `tests` VALUES (1,'main',1,NULL),(2,'main',1,NULL);
INSERT INTO `inputs` VALUES (1,'5',TRUE,1),(2,'10',TRUE,2);
INSERT INTO `outputs` VALUES (1,'false',1),(2,'true',2);