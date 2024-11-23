import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_components/admin/widgets/admin_menu_item.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/theme/theme_extension.dart';
import 'package:portfolio/src/localization/l10n.dart';
import 'package:portfolio/src/routing/admin_app_route.dart';

class AdminDrawer extends StatelessWidget {
  const AdminDrawer({super.key, this.onPageSelected});
  final VoidCallback? onPageSelected;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 230,
      child: ColoredBox(
        color: context.theme.cardColor,
        child: Padding(
          padding: const EdgeInsets.all(Sizes.globalPadding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              gapH48,
              Text(
                context.l10n.adminPanel,
                style: context.headlineSmall?.copyWith(color: Colors.white),
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
