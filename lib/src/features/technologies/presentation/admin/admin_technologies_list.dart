import 'package:flutter/material.dart';
import 'package:portfolio/src/core/common_widgets/responsive_center.dart';
import 'package:portfolio/src/core/constants/app_sizes.dart';
import 'package:portfolio/src/features/technologies/domain/technology.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/admin_technology_page.dart';
import 'package:portfolio/src/features/technologies/presentation/admin/widgets/technology_list_card.dart';

class AdminTechnologiesList extends StatelessWidget {
  const AdminTechnologiesList({required this.technologies, super.key});
  final List<Technology> technologies;
  @override
  Widget build(BuildContext context) {
    return ResponsiveCenter(
      padding: const EdgeInsets.all(Sizes.globalPadding),
      child: ListView.builder(
        shrinkWrap: true,
        itemCount: technologies.length,
        itemBuilder: (context, index) => Padding(
          padding: const EdgeInsets.symmetric(vertical: Sizes.p8),
          child: InkWell(
            onTap: () {
              showDialog<void>(
                context: context,
                builder: (context) =>
                    AdminTechnologyPage(technology: technologies[index]),
              );
            },
            borderRadius: BorderRadius.circular(Sizes.p8),
            child: TechnologyListCard(technology: technologies[index]),
          ),
        ),
      ),
    );
  }
}
