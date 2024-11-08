import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_components/admin_menu_item.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/routing/admin_app_route.dart';

class AdminDrawer extends StatelessWidget {
  const AdminDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return SizedBox(
      width: 230,
      child: ColoredBox(
        color: theme.cardColor,
        child: Padding(
          padding: const EdgeInsets.all(Sizes.globalPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              gapH48,
              Text(
                'Admin Panel',
                style: theme.textTheme.headlineSmall
                    ?.copyWith(color: Colors.white),
              ),
              const Divider(
                color: Colors.white,
              ),
              gapH14,
              ...AdminAppRoute.values.map(
                (route) => AdminMenuItem(
                  title: route.title,
                  path: route.path,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
