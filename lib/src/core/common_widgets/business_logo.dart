import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:portfolio/src/core/constants/assets.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/routing/app_route.dart';

class BusinessLogo extends StatelessWidget {
  const BusinessLogo({
    this.height,
    this.width,
    this.large = true,
    super.key,
  });

  final double? height;
  final double? width;
  final bool large;

  @override
  Widget build(BuildContext context) {
    final routerPath =
        GoRouter.of(context).routeInformationProvider.value.uri.path;

    final alreadyInhome = routerPath == AppRoute.home.path;
    return InkWell(
      onTap: alreadyInhome.whenOrNull(
        isFalse: () => () => context.go(AppRoute.home.path),
      ),
      child: Image.asset(
        large ? Assets.largeLogoDark : Assets.shortLogoDark,
        isAntiAlias: true,
        fit: BoxFit.contain,
        height: height,
        width: width,
      ),
    );
  }
}
