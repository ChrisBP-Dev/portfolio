import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/common_components/admin_page_container.dart';

import 'package:portfolio/src/features/projects/presentation/components/image_viewer.dart';
import 'package:portfolio/src/routing/admin_app_route.dart';
import 'package:portfolio/src/routing/app_route.dart';
import 'package:portfolio/src/routing/not_found_page.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';
part 'app_router.g.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();
// final _shellAdminNavigatorKey = GlobalKey<NavigatorState>();

@Riverpod(keepAlive: true)
GoRouter goRouter(Ref ref) {
  return GoRouter(
    navigatorKey: _rootNavigatorKey,
    initialLocation: '/',
    routes: [
      ShellRoute(
        navigatorKey: _shellNavigatorKey,
        pageBuilder: (context, state, child) => CustomTransitionPage<void>(
          key: state.pageKey,
          child: AdminPageContainer(page: child),
          transitionsBuilder: (_, animation, __, child) => FadeTransition(
            opacity: animation,
            child: child,
          ),
        ),
        routes: [
          ...AdminAppRoute.shellRoutes.map(
            (route) {
              return GoRoute(
                path: route.path,
                name: route.name,
                pageBuilder: (context, state) => CustomTransitionPage<void>(
                  key: state.pageKey,
                  child: route.page,
                  transitionsBuilder: (_, animation, __, child) =>
                      FadeTransition(
                    opacity: animation,
                    child: child,
                  ),
                ),
                // routes: subRoute,
              );
            },
          ),
          ...AppRoute.shellRoutes.map(
            (route) {
              return GoRoute(
                path: route.path,
                name: route.name,
                pageBuilder: (context, state) => CustomTransitionPage<void>(
                  key: state.pageKey,
                  child: route.page,
                  transitionsBuilder: (_, animation, __, child) =>
                      FadeTransition(
                    opacity: animation,
                    child: child,
                  ),
                ),
                // routes: subRoute,
              );
            },
          ),
        ],
      ),
      GoRoute(
        path: '${AppRoute.imageViewer.path}/:id/:index',
        name: AppRoute.imageViewer.name,
        pageBuilder: (context, state) => CustomTransitionPage<void>(
          key: state.pageKey,
          child: const ImageViewer(),
          transitionsBuilder: (_, animation, __, child) => FadeTransition(
            opacity: animation,
            child: child,
          ),
        ),
      ),
    ],
    errorBuilder: (context, state) => const NotFoundPage(),
  );
}
