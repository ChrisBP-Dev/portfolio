import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_components/admin_drawer.dart';
import 'package:portfolio/src/core/common_widgets/responsive_widget.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/settings/presentation/switch_locale_widget.dart';
import 'package:portfolio/src/features/settings/presentation/switch_theme_widget.dart';

class AdminPageContainer extends StatelessWidget {
  const AdminPageContainer({required this.page, super.key});
  final Widget page;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AdminDrawer(),
      body: ResponsiveWidget(
        mobile: page,
        desktop: Row(
          children: [
            const AdminDrawer(),
            Expanded(child: page),
          ],
        ),
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          ResponsiveWidget(
            mobile: Builder(
              builder: (context) {
                return FloatingActionButton(
                  onPressed: () => Scaffold.of(context).openDrawer(),
                  child: const Icon(Icons.menu),
                );
              },
            ),
            desktop: const SizedBox.shrink(),
          ),
          gapH14,
          const SwitchThemeWidget(),
          gapH14,
          const SwitchLocaleWidget(),
        ],
      ),
    );
  }
}
