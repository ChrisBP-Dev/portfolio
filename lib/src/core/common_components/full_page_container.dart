import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_components/admin/admin_drawer.dart';
import 'package:portfolio/src/core/common_widgets/responsive_widget.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/core/utils/bool_extensions.dart';
import 'package:portfolio/src/features/settings/presentation/switch_locale_widget.dart';
import 'package:portfolio/src/features/settings/presentation/switch_theme_widget.dart';

class FullPageContainer extends StatefulWidget {
  const FullPageContainer({
    required this.page,
    required this.isAdmin,
    super.key,
  });
  final Widget page;
  final bool isAdmin;

  @override
  State<FullPageContainer> createState() => _FullPageContainerState();
}

class _FullPageContainerState extends State<FullPageContainer> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: widget.isAdmin.whenOrNull(isTrue: AdminDrawer.new),
      body: widget.isAdmin.when(
        isTrue: () => ResponsiveWidget(
          mobile: widget.page,
          desktop: Row(
            children: [
              AdminDrawer(onPageSelected: () => setState(() {})),
              Expanded(child: widget.page),
            ],
          ),
        ),
        isFalse: () => widget.page,
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          if (widget.isAdmin) ...[
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
          ],
          const SwitchThemeWidget(),
          gapH14,
          const SwitchLocaleWidget(),
        ],
      ),
    );
  }
}
