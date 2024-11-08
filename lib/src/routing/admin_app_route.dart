import 'package:flutter/widgets.dart';
import 'package:portfolio/src/features/projects/presentation/admin/project_list/admin_projects_list_page.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/technologies_list/admin_technologies_list_page.dart';

enum AdminAppRoute {
  adminTechnologies(
    path: '/admin/technologies',
    page: AdminTechnologiesListPage(),
  ),
  adminProjects(
    path: '/admin/projects',
    page: AdminProjectsListPage(),
  ),
  adminExperiences(
    path: '/admin/experiences',
    page: AdminTechnologiesListPage(),
  ),
  ;

  const AdminAppRoute({
    required this.path,
    required this.page,
  });

  final String path;
  final Widget page;
  // final String? subPath; // change this if you want to add subroutes
  static List<AdminAppRoute> get shellRoutes => [
        AdminAppRoute.adminProjects,
        AdminAppRoute.adminExperiences,
        AdminAppRoute.adminTechnologies,
      ];
}

extension AdminAppRouteX on AdminAppRoute {
  String get title {
    return path.split('/').last.toUpperCase();
  }
}
