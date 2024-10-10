import 'package:flutter/widgets.dart';
import 'package:portfolio/src/features/contact/presentation/contact_page.dart';
import 'package:portfolio/src/features/experience/presentation/experience_page.dart';
import 'package:portfolio/src/features/home/presentation/home_page.dart';
import 'package:portfolio/src/features/projects/presentation/projects_page.dart';

enum AppRoute {
  home(
    path: '/',
    page: HomePage(),
  ),
  projects(
    path: '/projects',
    page: ProjectsPage(),
  ),
  experience(
    path: '/experience',
    page: ExperiencePage(),
  ),
  contact(
    path: '/contact',
    page: ContactPage(),
  ),

  // not implemented yet
  // signIn
  // signUp

  ;

  const AppRoute({
    required this.path,
    required this.page,
  });

  final String path;
  final Widget page;
}
